const { User } = require("discord.js");
const { DBBase } = require("./all");

class CustomUser extends User {
	constructor(client, data) {
		super(client, data);
		this.db = new DBBase(client.db.user, this.id);
	}
}

module.exports = CustomUser;