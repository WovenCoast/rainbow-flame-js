require('dotenv').config();
class Util {
  constructor(client) {
    this.client = client;
  }
  parseUser(value) {
    return this.client.users.cache.find(u => u.id === value.replace(/[^0-9]/gi, "")) || this.client.users.cache.find(u => u.username === value.replace(/[^A-Za-z0-9]/gi, "")) || this.client.users.cache.find(u => u.tag.replace(/[^A-Za-z0-9]/gi, "") === value.replace(/[^A-Za-z0-9]/gi, ""));
  }
  formatMoney(value) {
    return "UC " + value;
  }
  randomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  convertMs(ms) {
    const showWith0 = value => (value < 10 ? `0${value}` : value);
    const days = showWith0(Math.floor((ms / (1000 * 60 * 60 * 24)) % 60));
    const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 24));
    const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
    const seconds = showWith0(Math.floor((ms / 1000) % 60));
    if (parseInt(days)) return `${days}d`;
    if (parseInt(hours)) return `${hours}h`;
    if (parseInt(minutes)) return `${minutes}min`;
    if (parseInt(seconds)) return `${seconds}s`;
    if (parseInt(ms)) return `${ms}ms`;
  }
  convertBytes(bytes) {
    const decimals = 2;
    if (bytes == 0) return "0 Bytes";
    var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
  pluralify(amount, string) {
    if (amount === 1) return amount + " " + string;
    else return amount + " " + string + "s";
  }
}
const Endb = require('endb');
const removePunctuation = /[^A-Za-z0-9]/gi;
class DB {
  constructor(client, schema, options) {
    this.types = {
      string: (client, arg) => arg.toString(),
      int: (client, arg) => !isNaN(arg) ? parseInt(arg) : null,
      float: (client, arg) => !isNaN(arg) ? parseFloat(arg) : null,
      channel: (client, arg) => client.channels.cache.has(arg.replace(removePunctuation, "")) ? client.channels.cache.get(arg.replace(removePunctuation, "")) : null,
      role: (client, arg) => client.guilds.cache.some(guild => Array.from(guild.roles.cache).some(role => role.id === arg.replace(removePunctuation, ""))).roles.cache.get(arg.replace(removePunctuation, "")) ? client.guilds.cache.find(guild => Array.from(guild.roles.cache).some(role => role.id === arg.replace(removePunctuation, ""))).roles.cache.get(arg.replace(removePunctuation, "")) : null
    };
    this.schema = schema;
    this.client = client;
    this.db = new Endb(options);
    this.db.on('error', error => console.error('Connection Error: ', error));
  }
  async get(uid, key) {
    if (this.schema[key].array) return (await this.db.ensure(uid + ":" + key, this.schema[key].default || [])).map(v => this.types[this.schema[key].type](this.client, v));
    return this.types[this.schema[key].type](this.client, await this.db.ensure(uid + ":" + key, this.schema[key].default));
  }
  async set(uid, key, value) {
    if (this.schema[key].modifiable) return await this._set(uid, key, value)
    else return false;
  }
  async _set(uid, key, value) {
    if (this.schema[key].array) {
      if (!(value instanceof Array)) return new Error(`Expected Array<${this.schema[key].type}> but got ${typeof value}.`);
      if (value.some(v => this.types[this.schema[key].type](this.client, v) === null)) return new Error(`Not all values of Array<${this.schema[key].type}> are convertable`);
      const res = await this.db.set(uid + ":" + key, value);
      return res;
    }
    if (this.types[this.schema[key].type](this.client, value) === null) return new Error(`Cannot set ${key} of type ${this.schema[key].type} to ${value}`);
    const res = await this.db.set(uid + ":" + key, value);
    return res;
  }
}
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
client.prefix = ["rf."];
client.presences = [
  (client) => `${client.util.pluralify(client.users.cache.size, "user")}!`,
  (client) => `${client.util.pluralify(client.channels.cache.size, "channel")}!`,
  (client) => `${client.util.pluralify(client.guilds.cache.size, "guild")}!`
];
client.templates = {
  "guild": (member) => member.guild.name,
  "username": (member) => member.user.username,
  "tag": (member) => member.user.tag,
  "user": (member) => member.user.tag,
  "discriminator": (member) => member.user.discriminator
}
const colorScheme = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
client.colors = {
  info: "#92DFF3",
  error: colorScheme[0],
  success: colorScheme[4]
};
client.commandsExec = 0;
client.commandsSuccess = 0;
client.commandsFail = 0;
client.defaultCooldown = 2;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Map();
client.queue = new Map();
const schemas = require('./schemas.json');
client.db = {};
client.db.guild = new DB(client, schemas.guild, { uri: 'sqlite://.data/guilds.sqlite', namespace: "guild" });
client.db.user = new DB(client, schemas.user, { uri: 'sqlite://.data/users.sqlite', namespace: "user" });
client.db.member = new DB(client, schemas.member, { uri: 'sqlite://.data/members.sqlite', namespace: "member" });
client.categories = {};
client.util = new Util(client);
fs.readdirSync(path.join(__dirname, "./commands")).forEach(dir => {
  client.categories[client.util.titleCase(dir)] = [];
  fs.readdirSync(path.join(__dirname, "./commands", dir)).forEach(
    commandPath => {
      const command = require(path.join(
        __dirname,
        "./commands",
        dir,
        commandPath
      ));
      command.category = client.util.titleCase(dir);
      command.name = (command.name || commandPath.split(" ")[0]);
      command.aliases = (command.aliases || []);
      command.usage = (command.usage || `{prefix}${command.name}`);
      client.categories[command.category].push(command.name);
      client.commands.set(command.name, command);
      command.aliases.forEach(alias => {
        client.aliases.set(alias, command.name);
      });
    }
  );
});
fs.readdirSync(path.join(__dirname, "./events")).forEach(evt => {
  const event = require(path.join(__dirname, "./events", evt));
  client.on(event.name || evt.split(".")[0], (...args) => {
    event.exec(client, ...args).catch(console.error);
  });
})

client.login(process.env.DISCORD_TOKEN);
const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "CatOnKeyboard",
    resave: false,
    saveUninitialized: false
  })
);
app.use((err, req, res, next) => {
  switch (err.message) {
    case "NoCodeProvided":
      return res.status(400).send({
        status: "ERROR",
        error: err.message
      });
    default:
      return res.status(500).send({
        status: "ERROR",
        error: err.message
      });
  }
});
const catchAsync = fn => (req, res, next) => {
  const routePromise = fn(req, res, next);
  if (routePromise.catch) {
    routePromise.catch(err => next(err));
  }
};
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/api/discord/login");
  } else {
    next();
  }
};
const domain = "https://rainbowflame.glitch.me"

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/dashboard"/*, requireAuth*/, (req, res) => {
  res.render("dashboard.ejs");
});
app.get("/api/discord/login", (req, res) => {
  if (req.session.accessToken) {
    res.redirect(domain + '/dashboard');
  } else {
    res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=${
      process.env.CLIENT_ID
      }&scope=${encodeURIComponent(
        "identify email guilds"
      )}&response_type=code&redirect_uri=${encodeURIComponent(
        domain + "/api/discord/callback"
      )}`
    );
  }
});
app.get(
  "/api/discord/callback",
  catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error("NoCodeProvided");
    const code = req.query.code;
    const response = await fetch(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${domain + "/api/discord/callback"}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          )}`
        }
      }
    );
    const json = await response.json();
    req.session.accessToken = json.access_token;
    req.session.refreshToken = json.refresh_token;
    const userData = await fetch("https://discordapp.com/api/users/@me", {
      method: "GET",
      headers: {
        Authorization: `${json.token_type} ${json.access_token}`
      }
    })
      .then(res => res.json())
      .catch(console.error);
    req.session.user = userData;
    const guildData = await fetch(
      "https://discordapp.com/api/users/@me/guilds",
      {
        method: "GET",
        headers: {
          Authorization: `${json.token_type} ${json.access_token}`
        }
      }
    )
      .then(res => res.json())
      .catch(console.error);
    req.session.user.guilds = guildData.filter(
      g => !!client.guilds.resolve(g.id)
    );
    res.redirect(domain + '/dashboard');
  })
);

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


// Great Job you have successfully reached the end of this file! Kudos to you and your eyes. Still didn't find the bug, dw you will find it soon! 