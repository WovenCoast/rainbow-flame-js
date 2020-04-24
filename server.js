require('dotenv').config();
const { Client } = require('./lib/all');
const schemas = require('./schemas.json');
const { version } = require('./package.json');
const client = new Client({
  token: process.env.DISCORD_TOKEN,
  version,
  cooldown: 2,
  colors: {
    scheme: ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'],
    info: "#92DFF3",
    error: '#FF9AA2',
    success: '#B5EAD7'
  },
  prefix: ["rf.", "rf ", "rf!", "rf>", ">rf ", "rf-", "-rf", "*rf ", "rf*"],
  presences: [
    (client) => `${client.util.pluralify(client.users.cache.size, "user")}!`,
    (client) => `${client.util.pluralify(client.channels.cache.size, "channel")}!`,
    (client) => `${client.util.pluralify(client.guilds.cache.size, "guild")}!`
  ],
  schemas,
  commands: './commands',
  events: './events'
}, {});
client.login();
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