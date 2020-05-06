const Discord = require("discord.js");
module.exports = {
    name: "avatar",
    aliases: [],
    desc: "Sends the avatar of the user mentioned",
    async exec(client, message, args) {
        var user = args;
        let embed = new Discord.RichEmbed()
        .setImage(user.avatarURL)
        .setColor('#275BF0')
        message.channel.send(embed)
        return;
    }
}