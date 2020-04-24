const Discord = require('discord.js');
const util = require('util');
const haste = require('hastebin-gen');

module.exports = {
  name: "eval",
  aliases: [],
  desc: "Evaluate an expression",
  usage: "{prefix}eval <...expression:string>",
  cooldown: 2,
  async exec(client, message, args) {
    if (!client.owners.includes(message.author.id)) throw new Error("You don't have enough permissions to evaluate a JavaScript command on me");
    if (!args.join(' ')) {
      return message.channel.send('Nothing to be evaled')
    }
    var evaled;
    let color = client.colors.info;
    try {
      evaled = eval(args.join(' '));
      if (evaled instanceof Promise) evaled = await evaled;
      if (typeof evaled != "string") {
        evaled = util.inspect(evaled);
      }
      if (evaled.length > 1024) {
        evaled = await haste(evaled.replace(client.token, "no cyka blyat"), { url: "http://haste.wovencoast.me", extension: "log" }).catch(err => { throw err });
      }
    } catch (e) {
      evaled = e.stack;
      if (evaled.length > 1024) {
        evaled = evaled.substr(0, 1000) + "...";
      }
      color = client.colors.error;
    }
    var embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor(color)
      .addField('Input', args.join(' '))
      .addField('Output', evaled.replace(client.token, "no cyka blyat"))
    message.channel.send(embed)
  }
}