const { Guild } = require("discord.js");

class EnhancedGuild extends Guild {
	constructor(client, data) {
		super(client, data);
	}
}

module.exports = EnhancedGuild;