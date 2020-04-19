const Discord = require('discord.js');

const firstArguments = ["list", "add", "remove", "set"]

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
      const value = await client.db.guild.get(message.guild.id, args[1]);
    }
  }
}