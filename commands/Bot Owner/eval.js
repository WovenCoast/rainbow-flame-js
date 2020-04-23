const Discord = require('discord.js');
const util = require('util');
const { VultrexHaste } = require('vultrex.haste');
const haste = new VultrexHaste({ url: "https://hastebin.com" });

module.exports = {
  name: "eval",
  aliases: [],
  desc: "Evaluate an expression",
  usage: "{prefix}eval <...expression:string>",
  cooldown: 2,
  async exec(client, message, args) {
    if (!["502446928303226890"].includes(message.author.id)) throw new Error("You don't have enough permissions to evaluate a JavaScript command on me");
    if (!args.join(' ')) {
      return message.channel.send('Nothing to be evaled')
    }
    var evaled;
    let color = client.colors.info;
    try {
      evaled = eval(args.join(' '));
      if (evaled.constructor.name === "Promise") evaled = await evaled;
      if (typeof evaled != "string") {
        evaled = util.inspect(evaled);
      }
      if (evaled.length > 1024) {
        evaled = await haste.post(evaled);
      }
    } catch (e) {
      evaled = e.stack;
      if (evaled.length > 1024) {
        evaled = evaled.substr(0, 1000) + "...";
      }
      color = client.colors.error;
    }
    var embed = new Discord.MessageEmbed()
    embed.addField('Input', args.join(' '))
    embed.addField('Output', evaled)
    embed.setColor(color)
    message.channel.send(embed)
  }
}