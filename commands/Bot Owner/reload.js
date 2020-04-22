const Discord = require('discord.js');
const path = require('path');

module.exports = {
	name: "reload",
	aliases: [],
	desc: "Reload everything in the bot",
	async exec(client, message, args) {
		if (!["502446928303226890"].includes(message.author.id)) throw new Error("You don't have enough permissions to reload my commands");
		client.commands.forEach(command => {
			delete require.cache[require.resolve(path.join(require.main.path, client.customOptions.commands, command.category, command.name + ".js"))];
		})
		client.removeAllListeners();
		client.commands = new Discord.Collection();
		client.aliases = new Discord.Collection();
		client._readCommands(client.customOptions.commands);
		client._readEvents(client.customOptions.events);
		message.channel.send(":white_check_mark: Successfully reloaded all the commands!");
	}
}