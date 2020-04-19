const Discord = require('discord.js');

module.exports = {
  name: "balance",
  aliases: ["bal"],
  desc: "View your balance",
  usage: "{prefix}balance [user:string|user:mention]",
  async exec(client, message, args) {
    let user = message.author;
    if (args[0] && client.util.parseUser(args.join(" "))) user = client.util.parseUser(args.join(" "));
    if (user.bot) throw new Error("Bots don't have a balance!");
    const bank = await client.db.user.get(user.id, "bank");
    const wallet = await client.db.member.get(message.guild.id + user.id, "wallet");
    return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.author.tag} | Balance`, message.author.displayAvatarURL({ dynamic: true })).setDescription(`Bank: **${client.util.formatMoney(bank)}**\nWallet: **${client.util.formatMoney(wallet)}**`));
  }
}