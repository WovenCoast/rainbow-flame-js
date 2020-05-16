const Discord = require("discord.js");
const os = require("os");

module.exports = {
  name: "stats",
  aliases: ["info", "stat", "botstat", "status", "uptime"],
  desc: "View the stats of this bot",
  async exec(client, message, args) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(`${client.user.tag} | Stats`, client.user.displayAvatarURL())
        .addField(
          "Software Info",
          `${client.user.username}: \`${client.version}\`\nNode: \`v${process.versions.node}\`\nDiscord.js: \`v${Discord.version}\`\nPlatform: \`${process.platform} (${process.arch})\``
        )
        .addField(
          "Server Info",
          `Uptime: \`${client.util.convertMs(
            client.uptime
          )}\`\nPing: \`${client.util.convertMs(
            client.ws.ping
          )}\`\nMemory Usage: \`${client.util.convertBytes(
            process.memoryUsage().heapUsed
          )} / ${client.util.convertBytes(os.totalmem())}\``
        )
        .addField(
          "Bot Usage",
          `Users: \`${client.users.cache.size}\`\nGuilds: \`${client.guilds.cache.size}\`\nChannels: \`${client.channels.cache.size}\`\nCommands Executed: \`${client.commandStatus.exec}\`\nCommands Successful: \`${client.commandStatus.success}\`\nCommands Failed: \`${client.commandStatus.fail}\``
        )
    );
  },
};
