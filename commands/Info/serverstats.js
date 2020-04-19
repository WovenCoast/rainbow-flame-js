const Discord = require('discord.js');

module.exports = {
  name: "serverstats",
  aliases: ["server", "serverinfo"],
  desc: "View the stats of your server",
  async exec(client, message, args) {
    return message.channel.send(new Discord.MessageEmbed().setAuthor(`${message.guild.name} | Stats`, message.guild.iconURL({ dynamic: true })).setDescription(`Channels: \`${message.guild.channels.cache.size}\`\nMembers: \`${message.guild.memberCount}\`\nEmojis: \`${message.guild.emojis.cache.size}\``))
  }
}