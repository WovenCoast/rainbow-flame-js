const Discord = require("discord.js");
const moment = require("relative-time-parser");

module.exports = {
  name: "ban",
  aliases: ["exile"],
  desc: "BAN HAMMER!!!!!!",
  usage: "{prefix}ban <victim:member> <duration:time> [reason:string]",
  async exec(client, message, args) {
    const reason = args.slice(2).join(" ") || "No reason at all";
    const ms = Math.round(moment() - moment().relativeTime("-" + args[1]));
    if (!ms) throw new Error(`${args[1]} is not a valid timestamp!`);
    const days = ms / 8.64e7;
    const member = client.util.parseMember(message.guild, args[0]);
    if (!member) throw new Error(`${args} couldn't be resolved to a member!`);
    if (!message.member.hasPermission("BAN_MEMBERS"))
      throw new Error("You don't have enough permissions to ban!");
    if (!member.kickable)
      throw new Error(
        `I don't have enough permissions to ban ${member.user.tag}!`
      );
    await member.ban({ reason, days });
    message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(`${message.author.tag} | Ban Hammer`)
        .setDescription(`Banned ${member.user.tag}`)
        .addField("Reason", reason)
        .addField("Duration", client.util.convertMs(ms))
    );
  },
};
