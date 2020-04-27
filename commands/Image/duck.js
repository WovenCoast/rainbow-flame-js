const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "duck",
  aliases: [],
  desc: "Show an image of a duck",
  async exec(client, message, args) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setTitle("Quack!")
        .setImage(
          (
            await axios.get(
              "http://random-d.uk/api/v1/random?type=" +
                (Math.random() > 0.5 ? "gif" : "png")
            )
          ).data.url
        )
    );
  }
};
