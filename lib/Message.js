const { Message, MessageEmbed, TextChannel, DMChannel } = require('discord.js');
const Client = require('./Client');
const EnhancedGuild = require('./Guild');
const EnhancedUser = require('./User');

class EnhancedMessage extends Message {
	/**
	 * The enhanced message structure for RainbowFlame
	 * @param {Client} client 
	 * @param {any} data 
	 * @param {TextChannel | DMChannel} channel 
	 */
	constructor(client, data, channel) {
		super(client, data, channel);
		this._processMessage(client);
	}

	async _processMessage(client) {
		if (this.author.bot) return;
		if (
			this.content.trim() === `<@${client.user.id}>` ||
			this.content.trim() === `<@!${client.user.id}>`
		)
			return this.channel.send(
				`Hey there! Try doing \`${client.util.getRandom(
					client.prefix
				)}help\` to see my commands!`
			);
		const prefixes = [
			`<@${client.user.id}>`,
			`<@!${client.user.id}>`,
			...client.prefix.map(p => p.trim()),
			...(await (client.db.guild.get(this.guild.id, "prefix")))
		];
		if (!prefixes.some(p => this.content.toLowerCase().startsWith(p.toLowerCase()))) return;
		const prefix = prefixes
			.find(p => this.content.replace(/[^A-Za-z0-9]/gi, " ").toLowerCase().startsWith(p.replace(/[^A-Za-z0-9]/gi, " ").trim().toLowerCase()))
			.toLowerCase();
		const invoke = this.content
			.replace(/[^A-Za-z0-9]/gi, " ")
			.substr(prefix.length, this.content.length)
			.trim()
			.split(" ")[0]
			.toLowerCase();
		if (!client.commands.has(invoke) && !client.aliases.has(invoke))
			return this.channel.send(
				`**${invoke}** is not a valid command. Try doing \`${client.util.getRandom(
					client.prefix
				)}help\` to see what my commands are!`
			);
		const command = client.commands.has(invoke)
			? client.commands.get(invoke)
			: client.commands.get(client.aliases.get(invoke));
		const args = this.content
			.slice(invoke.length + prefix.length + 1)
			.trim()
			.split(' ');
		this.prefix = prefix;
		this.invoke = invoke;
		this.args = args;
		client.cooldown.forEach((cooldown, id) => {
			if (((Date.now() - cooldown) / 1000) > 100) client.cooldown.delete(id);
		});
		if (
			client.cooldown.has(
				`${this.author.id}-${this.guild.id}-${command.name.toLowerCase()}`
			)
		) {
			const timeGone =
				(Date.now() -
					client.cooldown.get(
						`${this.author.id}-${
						this.guild.id
						}-${command.name.toLowerCase()}`
					)) /
				1000;
			if (timeGone + 1 > (command.cooldown || client.defaultCooldown))
				client.cooldown.set(
					`${this.author.id}-${
					this.guild.id
					}-${command.name.toLowerCase()}`,
					Date.now()
				);
			else
				return this.channel.send(
					new MessageEmbed()
						.setTimestamp()
						.setAuthor(
							`${this.author.tag} | ${client.util.titleCase(invoke)}`,
							this.author.displayAvatarURL()
						)
						.setColor(client.colors.error)
						.setDescription(
							`Error: You need to wait ${client.util.pluralify(
								Math.floor(
									(command.cooldown || client.defaultCooldown) - timeGone
								),
								"more second"
							)} before you can use that command!`
						)
				);
		} else {
			client.cooldown.set(
				`${this.author.id}-${this.guild.id}-${command.name.toLowerCase()}`,
				Date.now()
			);
		}
		command
			.exec(client, this, args)
			.then(() => {
				client.commandStatus.success++;
				client.commandStatus.exec++;
			})
			.catch(err => {
				client.commandStatus.fail++;
				client.commandStatus.exec++;
				this.channel.send(
					new MessageEmbed()
						.setTimestamp()
						.setAuthor(`${this.author.tag} | ${client.util.titleCase(command.name)}`, this.author.displayAvatarURL({ dynamic: true }))
						.setColor(client.colors.error)
						.setDescription(`An error occured. Are you sure your usage matches \`${command.usage.replace("{prefix}", client.prefix[0])}\`?\n\n${err}`)
				);
			});
	}
}

module.exports = EnhancedMessage;