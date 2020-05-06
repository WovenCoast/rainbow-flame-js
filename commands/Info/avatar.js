const Discord = require('discord.js');

module.exports = {
    name: "avatar",
    aliases: [],
    desc: "Sends the avatar of the user mentioned",
    async exec(client, message, args) {
        const user = client.util.parseUser(args.join(" "));
        return message.channel.send(new Discord.RichEmbed()
        .setImage(user.avatarURL({ dynamic: true }))
        .setColor(client.colors.info).setAuthor(`${user.tag} | Avatar`).setTitle(`(Download Avatar)[${user.displayAvatarURL({ dynamic: true })}]`));
    }
}
