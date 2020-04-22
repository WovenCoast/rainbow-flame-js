const childProcess = require('child_process');
const Discord = require('discord.js');

module.exports = {
	name: "exec",
	aliases: [],
	desc: "Execute a command in a terminal",
	usage: "{prefix}exec <...expression:string>",
	async exec(client, message, args) {
		if (!["502446928303226890"].includes(message.author.id)) throw new Error("You don't have enough permissions to execute a terminal command on me");
		if (!args.join(' ')) {
			return message.channel.send('Nothing to be executed')
		}
		childProcess.exec(args.join(" "), { windowsHide: true, cwd: require.main.path }, (err, stdout, stderr) => {
			const embed = new Discord.MessageEmbed().setTimestamp().setAuthor(`${message.author.tag} | Exec`, message.author.displayAvatarURL({ dynamic: true }));
			if (err) {
				embed.setColor(client.colors.error).setTitle("Something went terribly wrong.....").setDescription(`\`\`\`${stderr}\`\`\``);
			} else {
				embed.setColor(client.colors.success).setDescription(`\`\`\`${stdout}\`\`\``);
			}
			message.channel.send(embed);
		});
	}
}