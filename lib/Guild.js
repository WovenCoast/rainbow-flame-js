const { Guild } = require("discord.js");

class EnhancedGuild extends Guild {
	constructor(client, data) {
		super(client, data);
		this.client = client;
	}
}

module.exports = EnhancedGuild;