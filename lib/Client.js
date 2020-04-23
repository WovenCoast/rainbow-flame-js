const Discord = require('discord.js');
const Util = require('./Util');
const DB = require('./DB');
const fs = require("fs");
const path = require("path");

const defaultOpts = {
	cooldown: 2,
	colors: {
		info: "BLUE",
		error: "RED",
		success: "GREEN"
	},
	prefix: [],
	presences: [
		(client) => `${client.util.pluralify(client.users.cache.size, "user")}!`,
		(client) => `${client.util.pluralify(client.channels.cache.size, "channel")}!`,
		(client) => `${client.util.pluralify(client.guilds.cache.size, "guild")}!`
	],
	templates: {
		"guild": (member) => member.guild.name,
		"username": (member) => member.user.username,
		"tag": (member) => member.user.tag,
		"user": (member) => member.user.tag,
		"discriminator": (member) => member.user.discriminator
	},
	schemas: {},
	commands: './commands',
	events: './events'
}
class Client extends Discord.Client {
	constructor(opts, discordOpts) {
		super(discordOpts)
		const options = Object.assign(defaultOpts, opts);
		this.customOptions = options;
		this.token = options.token;
		this.prefix = options.prefix;
		this.presences = options.presences;
		this.templates = options.templates;
		this.colors = options.colors;
		this.commandsExec = 0;
		this.commandsSuccess = 0;
		this.commandsFail = 0;
		this.defaultCooldown = options.cooldown;
		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();
		this.cooldown = new Map();
		this.queue = new Map();
		this.schemas = options.schemas;
		this.db = {};
		this.db.guild = new DB(this, this.schemas.guild, { uri: 'sqlite://.data/guilds.sqlite', namespace: "guild" });
		this.db.user = new DB(this, this.schemas.user, { uri: 'sqlite://.data/users.sqlite', namespace: "user" });
		this.db.member = new DB(this, this.schemas.member, { uri: 'sqlite://.data/members.sqlite', namespace: "member" });
		this.categories = {};
		this.util = new Util(this);
		this._readCommands(options.commands);
		this._readEvents(options.events);
	}

	_readCommands(folder) {
		fs.readdirSync(path.join(require.main.path, folder)).forEach(dir => {
			this.categories[dir] = [];
			fs.readdirSync(path.join(require.main.path, folder, dir)).forEach(
				commandPath => {
					const command = require(path.join(
						require.main.path,
						folder,
						dir,
						commandPath
					));
					command.category = dir;
					command.name = (command.name || commandPath.split(" ")[0]);
					command.aliases = (command.aliases || []);
					command.usage = (command.usage || `{prefix}${command.name}`);
					this.categories[command.category].push(command.name);
					this.commands.set(command.name, command);
					command.aliases.forEach(alias => {
						this.aliases.set(alias, command.name);
					});
				}
			);
		});
	}

	_readEvents(folder) {
		fs.readdirSync(path.join(require.main.path, folder)).forEach(evt => {
			const event = require(path.join(require.main.path, folder, evt));
			this.on(event.name || evt.split(".")[0], (...args) => {
				event.exec(this, ...args).catch(console.error);
			});
		})
	}

	login(token) {
		super.login(token || this.token);
	}
}

module.exports = Client;