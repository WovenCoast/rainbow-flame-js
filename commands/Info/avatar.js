const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: [],
  desc: "Sends the avatar of the user mentioned",
  async exec(client, message, args) {
    const user = client.util.parseUser(args.join(" ")) || message.author;
    return message.channel.send(
      new Discord.MessageEmbed()
        .setImage(user.displayAvatarURL({ dynamic: true }))
        .setColor(client.colors.info)
        .setAuthor(`${user.tag} | Avatar`, user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `[Download Avatar](${user.displayAvatarURL({ dynamic: true })})`
        )
    );
  },
};
