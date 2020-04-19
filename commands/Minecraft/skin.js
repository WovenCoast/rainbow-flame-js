const Discord = require("discord.js");

module.exports = {
  name: "skin",
  aliases: ["mc-skin"],
  desc: "View the Minecraft skin of a user",
  usage: "{prefix}skin <username:string>",
  async exec(client, message, args) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | ${args[0]}'s minecraft skin`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setImage(`https://minotar.net/body/${args[0]}/100.png`)
        .setDescription(`[Download Skin](https://minotar.net/skin/${args[0]})`)
    );
  }
};
