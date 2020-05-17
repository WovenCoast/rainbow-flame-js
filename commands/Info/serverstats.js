const Discord = require("discord.js");

module.exports = {
  name: "serverstats",
  aliases: ["server", "serverinfo"],
  desc: "View the stats of your server",
  async exec(client, message, args) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.guild.name} | Stats`,
          message.guild.iconURL({
            dynamic: true
          })
        )
        .addField(
          "Important Things",
          `Guild ID: \`${message.guild.id}\`\nNitro boosts: \`${
            message.guild.premiumSubscriptionCount
          }\`\nChannels: \`${message.guild.channels.cache.size}\`\nMembers: \`${
            message.guild.memberCount
          }\`\nRoles: \`${message.guild.roles.cache.size}\`\nEmojis: \`${
            message.guild.emojis.cache.size
          }\`\nVerification Level: \`${client.util.titleCase(
            message.guild.verificationLevel.replace("_", " ")
          )}\``
        )
        .addField(
          "Music",
          `Playing music: \`${
            message.guild.music.playing
              ? message.guild.music.connection.dispatcher.paused
                ? "Paused"
                : "Playing"
              : "Not playing"
          }\`\n${
            message.guild.music.playing
              ? `Number of songs: \`${
                  message.guild.music.songs.length
                }\`\nTotal duration: \`${client.util.convertDuration(
                  message.guild.music.songs
                    .map(s => s.duration)
                    .reduce((acc, s) => acc + s)
                )}\``
              : ""
          }`
        )
        .addField(
          "Features",
          message.guild.features.length === 0
            ? "Not a partnered guild"
            : message.guild.features
                .map(f => `\`${client.util.titleCase(f.replace("_", " "))}\``)
                .join(", ")
        )
    );
  }
};
