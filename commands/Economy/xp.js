const Discord = require("discord.js");

module.exports = {
  name: "xp",
  aliases: ["level", "rank"],
  desc: "View the ranking of you or someone else!",
  usage: "{prefix}xp [member:string|member:mention]",
  async exec(client, message, args) {
    let member = message.member;
    if (args[0] && client.util.parseMember(message.guild, args.join(" ")))
      member = client.util.parseMember(message.guild, args.join(" "));
    if (member.user.bot) throw new Error("Bots don't have a ranking!");
    const level = await member.db.get("level");
    const xp = await member.db.get("xp");
    const xpForNextLevel = level * 150;
    const progressBar =
      "•".repeat(Math.ceil((xp / 100) * 25)) +
      "-".repeat(Math.ceil(((xpForNextLevel - xp) / 100) * 25));
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.member.user.tag} | Rank`,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `XP: **${xp}xp**\nXP that needs for the next level: **${xpForNextLevel}xp**\nLevel **${level}**\n\n${level} ${progressBar} ${
            level + 1
          }`
        )
    );
  },
};
