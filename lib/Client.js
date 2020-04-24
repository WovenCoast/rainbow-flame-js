const Discord = require('discord.js');
const Util = require('./Util');
const DBClient = require('./DBClient');
const fs = require("fs");
const path = require("path");

/**
 * @typedef ClientOptions
 * 
 * @property {string} token The token that this bot will use if no token is given in login
 * @property {string} version The version of this bot
 * @property {number} cooldown The default cooldown for commands with none defined
 * @property {any} colors The colors for embeds in the client
 * @property {Array<string>} prefix The prefixes that can invoke a command in this bot
 * @property {Array<Function(Client)<string>>} presences The presences that this bot will display as its status
 * @property {Object<string, Function(GuildMember)<string>>} templates The valid templates to parse a user defined string with values based on the member
 * @property {any} schemas The schemas for this bot database
 * @property {string} commands The directory that the client would go through to find commands
 * @property {string} events The directory that the client would go through to find events
 */

/**
 * @typedef CommandStatus
 * 
 * @property {number} exec The number of executed commands
 * @property {number} success The number of successful commands
 * @property {number} fail The number of failed commands
 */

const defaultOpts = {
	cooldown: 2,
	version: "0.0.0",
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
	/**
	 * The custom client for RainbowFlame
	 * @param {ClientOptions} opts The custom client options that the client would use
	 * @param {Discord.ClientOptions} discordOpts 
	 */
	constructor(opts, discordOpts) {
		Discord.Structures.extend("Guild", (Guild) => {
			return require('./Guild');
		});
		super(discordOpts);
		const options = Object.assign(defaultOpts, opts);
		/**
		 * The custom options of this client
		 * @type {ClientOptions}
		 */
		this.customOptions = options;
		/**
		 * The token that this bot will use if no token is provided
		 * @type {string}
		 */
		this.token = options.token;
		/**
		 * The version of this bot
		 * @type {string}
		 */
		this.version = "v" + options.version;
		/**
		 * The prefixes for this bot
		 * @type {Array<string>}
		 */
		this.prefix = options.prefix;
		/**
		 * The presences that this client will display as statuses
		 * @type {Array<Function(Client)<string>>}
		 */
		this.presences = options.presences;
		/**
		 * The valid templates to parse a user defined string with values based on the member
		 * @type {Object<string, Function(GuildMember)<string>>}
		 */
		this.templates = options.templates;
		/**
		 * The colors for embeds in the client
		 * @type {any}
		 */
		this.colors = options.colors;
		/**
		 * The command statuses for this session
		 * @type {CommandStatus}
		 */
		this.commandStatus = {
			exec: 0,
			success: 0,
			fail: 0
		};
		/**
		 * The default cooldown for commands with none defined
		 * @type {number}
		 */
		this.defaultCooldown = options.cooldown;
		/**
		 * The commands store of this bot
		 * @type {Discord.Collection}
		 */
		this.commands = new Discord.Collection();
		/**
		 * The alias store of this bot
		 * @type {Discord.Collection}
		 */
		this.aliases = new Discord.Collection();
		/**
		 * The active cooldowns of this bot
		 * @type {Map<string, Date>}
		 */
		this.cooldown = new Map();
		/**
		 * All the music queues of this bot
		 * @type {Map<string, any>}
		 * @deprecated
		 */
		this.queue = new Map();
		/**
		 * The schemas for the bot's database
		 * @type {any}
		 */
		this.schemas = options.schemas;
		/**
		 * The databases of this bot
		 * @type {Object<string, DBClient>}
		 */
		this.db = {
			guild: new DBClient(this, this.schemas.guild, { uri: 'sqlite://.data/guilds.sqlite', namespace: "guild" }),
			user: new DBClient(this, this.schemas.user, { uri: 'sqlite://.data/users.sqlite', namespace: "user" }),
			member: new DBClient(this, this.schemas.member, { uri: 'sqlite://.data/members.sqlite', namespace: "member" })
		};
		/**
		 * The categories of this bot (populated after the client reads all the commands)
		 * @type {Object<string, Array<string>>}
		 */
		this.categories = {};
		/**
		 * The utilities of this client
		 * @type {Util}
		 */
		this.util = new Util(this);

		this._readCommands(options.commands);
		this._readEvents(options.events);
	}

	/**
	 * Read commands from a directory
	 * @param {string} folder The directory from the root folder to read for commands
	 * @private
	 */
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

	/**
	 * Read events from a directory
	 * @param {string} folder The directory from the root folder to read for events
	 * @private
	 */
	_readEvents(folder) {
		fs.readdirSync(path.join(require.main.path, folder)).forEach(evt => {
			const event = require(path.join(require.main.path, folder, evt));
			this.on(event.name || evt.split(".")[0], (...args) => {
				event.exec(this, ...args).catch(console.error);
			});
		})
	}

	/**
	 * Login the bot to the Discord API
	 * @param {string} [token=this.token] The token that the bot should login with, if not provided will login using the token provided in the options
	 */
	login(token = this.token) {
		super.login(token);
	}
}

module.exports = Client;