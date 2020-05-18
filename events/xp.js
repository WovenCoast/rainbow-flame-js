const Discord = require("discord.js");

module.exports = {
  name: "message",
  async exec(client, message) {
    if (message.author.bot) return;
    if (client.util.randomValue(0, 100) < 60) return; // Has a 60% rate of returning
    const currentLevel = await message.member.db.get("level");
    const xpForNextLevel = currentLevel * 150;
    const oldXp = await message.member.db.get("xp");
    const newXp = oldXp + client.util.randomValue(2, 5);
    if (newXp >= xpForNextLevel) {
      if (await message.guild.db.get("rankUpMsg")) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTimestamp()
            .setColor(client.colors.success)
            .setAuthor(
              `${message.author.tag} | Level Up!`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(`You just levelled upto ${currentLevel + 1}!`)
        );
      }
      await message.member.db.set("xp", 0, true);
      await message.member.db.set("level", currentLevel + 1, true);
    } else {
      await message.member.db.set("xp", newXp, true);
    }
  },
};
