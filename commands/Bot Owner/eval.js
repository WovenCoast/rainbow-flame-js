const Discord = require('discord.js');
const util = require('util');
const { VultrexHaste } = require('vultrex.haste');
const haste = new VultrexHaste({ url: "http://hasteb.in" });

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
        evaled = await haste.post(evaled).catch(err => { throw new Error(err) });
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
      .addField('Output', evaled)
    message.channel.send(embed)
  }
}