const Discord = require('discord.js');

module.exports = {
	name: "ban",
	aliases: ["exile"],
	desc: "BAN!!!!!!",
	async exec(client, message, args) {
		let banuser=args[0]
		Discord.Message.channel.send(banuser)
		/*user.ban(banuser);
		const banEmbed = new Discord()
			.addField('Banned:', banuser)
			.setColor('#420626');
		message.channel.send(banEmbed);*/
	}
}