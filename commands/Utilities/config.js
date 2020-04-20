const Discord = require('discord.js');

const firstArguments = ["list", "add", "remove", "set", "get"];

const deserializers = {
  "channel": (message, arg) => message.mentions.channels.first() || message.guild.channels.find(c => c.id === arg) || message.guild.channels.find(c => c.name === arg) || message.channel,
  "role": (message, arg) => message.mentions.roles.first() || message.guild.roles.find(r => r.id === arg) || message.guild.roles.find(r => r.name === arg) || null
}

module.exports = {
  name: "config",
  aliases: [],
  desc: "Configure your guild settings",
  usage: "{prefix}config <list|add|remove|set|get>",
  async exec(client, message, args) {
    if (!message.member.hasPermission([Discord.Permissions.FLAGS.MANAGE_GUILD])) throw new Error("You need to have the `MANAGE_GUILD` permission!");
    if (!firstArguments.includes(args[0])) throw new Error(`\`${args[0] || " "}\` is not a valid argument!`);
    const schema = client.db.guild.schema;
    const types = client.db.guild.types;
    const config = (await client.db.guild.db.all()).filter(v => v.key.startsWith(message.guild.id)).map(v => {
      v.key = v.key.replace(/[^A-Za-z]/gi, "");
      return v;
    });
    if (args[0] === "list") {
      return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.guild.name} | Config`, message.guild.iconURL({ dynamic: true })).setDescription([...config.map(c => `${c.key}: ${c.value instanceof Array ? c.value.map(v => `**${types[schema[c.key].type](client, v)}**`).join(",") : `**${types[schema[c.key].type](client, c.value)}**`}`), ...Object.keys(schema).filter(s => !config.map(t => t.key).includes(s))].join("\n")));
    } else if (args[0] === "get") {
      if (!args[1]) throw new Error("Nothing specified to get");
      if (!schema[args[1]]) throw new Error(`\`${args[1]}\` is not a valid key. Do \`${message.prefix}config list\` to get the keys!`)
      let value = await client.db.guild.get(message.guild.id, args[1]);
      if (!value) schema[args[1]].default;
      if (!value) throw new Error("Invalid value");
      return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.guild.name} | Config`, message.guild.iconURL({ dynamic: true })).setTitle(`Value for **${args[1]}**`).setDescription(value instanceof Array ? value.map(v => types[schema[args[1]].type](v)) : value));
    } else if (args[0] === "set") {
      if (!args[1]) throw new Error("No key specified");
      if (!schema[args[1]]) throw new Error(`\`${args[1]}\` is not a valid key. Do \`${message.prefix}config list\` to get the keys!`);
      if (!schema[args[1]].modifiable) throw new Error("You cannot modify this value!");
      if (schema[args[1]].array) throw new Error("This value must be an array! Use add and remove instead of set!");
      if (!args[2]) throw new Error("You can't set it to be nothing!");
      const type = schema[args[1]].type;
      const oldValue = await client.db.guild.get(message.guild.id, args[1]);
      let newValue = deserializers[type](message, args.slice(2, args.length).join(" "));
      if (!newValue) throw new Error(`${args.slice(2, args.length).join(" ")} is not a valid ${type}!`);
      await client.db.guild.set(message.guild.id, args[1], types[type](client, newValue));
      return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.guild.name} | Config`, message.guild.iconURL({ dynamic: true })).setTitle(`Set value for **${args[1]}**`).setDescription(``))
    }
  }
}