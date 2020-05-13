const Discord = require('discord.js');

module.exports = {
	name: "ban",
	aliases: ["exile"],
	desc: "BAN!!!!!!",
	async exec(client, message, args) {
		let banmember=args[0]
		message.channel.send("hi")
		member.ban(banmember);
		const banEmbed = new Discord.MessageEmbed()
			.addField('Banned:', banmember)
			.setColor('#420626');
		message.channel.send(banEmbed);
	}
}