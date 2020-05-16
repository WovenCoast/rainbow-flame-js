const Discord = require("discord.js");

module.exports = {
  name: "nick",
  aliases: ["getout"],
  desc: "NICK!!!!!!!",
  usage: "{prefix}nick <victim:member> <newNick:string>",
  async exec(client, message, args) {
    const nick = args.slice(1).join(" ");
    const member = client.util.parseMember(message.guild, args[0]);
    if (!member) throw new Error(`${args} couldn't be resolved to a member!`);
    if (!message.member.hasPermission("MANAGE_NICKNAMES"))
      throw new Error("You don't have enough permissions to nick someone!");
    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
      throw new Error("I don't have enough permissions to nick someone!");
    if (!nick) {
      await member.setNickname("");
      return message.channel.send(
        `:white_check_mark: Successfully reset **${member.user.tag}**'s nickname!`
      );
    }
    await member.setNickname(nick);
    return message.channel.send(
      `:white_check_mark: Successfully nicknamed **${member.user.tag}** to **${nick}**!`
    );
  },
};
