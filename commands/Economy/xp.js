const Discord = require("discord.js");

module.exports = {
  name: "xp",
  aliases: ["level", "rank"],
  desc: "View the ranking of you or someone else!",
  usage: "{prefix}xp [member:string|member:mention]",
  async exec(client, message, args) {
    let member = message.member;
    if (args[0] && client.util.parseMember(args.join(" ")))
      member = client.util.parseMember(args.join(" "));
    if (member.bot) throw new Error("Bots don't have a ranking!");
    const level = await member.db.get("level");
    const xp = await member.db.get("xp");
    const xpForNextLevel = level * 150;
    const progressBar = "•".repeat(xp) + "-".repeat(xpForNextLevel - xp);
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | Rank`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `XP: **${xp}xp**\nLevel **${level}**\n\n${level} ${progressBar} ${
            level + 1
          }`
        )
    );
  },
};
