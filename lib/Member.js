const { GuildMember } = require("discord.js");
const { DBBase, Client, Guild } = require("./all");

class Member extends GuildMember {
	/**
	 * A custom implementation of the member
	 * @param {Client} client The client associated with this member
	 * @param {any} data The data associated with this member
	 * @param {Guild} guild The guild associated with this member
	 */
	constructor(client, data, guild) {
		super(client, data, guild);
		/**
		 * The database associated with this member
		 * @type {DBBase}
		 */
		this.db = new DBBase(client.db.member, guild.id + this.id);
	}
}

module.exports = Member;