const childProcess = require('child_process');
const Discord = require('discord.js');

module.exports = {
	name: "exec",
	aliases: [],
	desc: "Execute a command in a terminal",
	usage: "{prefix}exec <...expression:string>",
	async exec(client, message, args) {
		if (!client.owners.includes(message.author.id)) throw new Error("You don't have enough permissions to execute a terminal command on me");
		if (!args.join(' ')) {
			return message.channel.send('Nothing to be executed')
		}
		const start = Date.now();
		childProcess.exec(args.join(" "), { windowsHide: true, cwd: require.main.path }, (err, stdout, stderr) => {
			const millis = Date.now() - start;
			const embed = new Discord.MessageEmbed().setTimestamp().setFooter(`Executed in ${client.util.convertMs(millis)} (${millis}ms)`).setAuthor(`${message.author.tag} | Exec`, message.author.displayAvatarURL({ dynamic: true })).addField("Input", `\`\`\`${args.join(" ")}\`\`\``);
			if (err) {
				embed.setColor(client.colors.error).setTitle("Something went terribly wrong.....").addField("Error", `\`\`\`${stderr}\`\`\``);
			} else {
				embed.setColor(client.colors.success).setTitle("Success!").addField("Output", `\`\`\`${stdout}\`\`\``);
			}
			message.channel.send(embed);
		});
	}
}