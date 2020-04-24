const { User } = require("discord.js");
const { DBBase } = require("./all");

class EnhancedUser extends User {
	/**
	 * The enhanced user for RainbowFlame
	 * @param {Client} client The client associated with this guild
	 * @param {*} data 
	 */
	constructor(client, data) {
		super(client, data);
		/**
		 * The database associated with this member
		 * @type {DBBase}
		 */
		this.db = new DBBase(client.db.user, this.id);
	}
}

module.exports = EnhancedUser;