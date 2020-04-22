const Discord = require("discord.js");
const axios = require("axios");
const api = "http://mcapi.us/server/status?ip=";

module.exports = {
  name: "mc-serverinfo",
  aliases: ["mc-server"],
  desc: "Find information about a server",
  usage: "{prefix}mc-serverinfo <ip:string|domain:string>",
  async exec(client, message, args) {
    if (!args[0]) throw new Error("Provide a server IP or domain!");
    const endpoint = api + encodeURIComponent(args[0].toLowerCase());
    message.channel.stopTyping(true);
    const res = (await axios.get(endpoint)).data;
    if ((res.players.max || 0) === 0)
      throw new Error("The provided IP is not a valid Minecraft server!");
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.author.tag} | ${args[0].toLowerCase()}`, message.author.displayAvatarURL({ dynamic: true }))
        .setColor(client.colors.info)
        .addField("Status", res.online ? "Online" : "Offline", true)
        .addField("Current Players", (res.players.now ? res.players.now : 0) + " players", true)
        .addField("Max Players", (res.players.max ? res.players.max : 0) + " players", true)
    );
  }
};
