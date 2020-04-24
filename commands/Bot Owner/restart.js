const childProcess = require('child_process');

module.exports = {
	name: "restart",
	aliases: [],
	desc: "Restart the bot",
	async exec(client, message, args) {
		if (!client.owners.includes(message.author.id)) throw new Error("You don't have enough permissions to restart meme");
		await childProcess.exec("git pull && npm i");
		await client.db.client.set(client.user.id, "restartInvokedChannel", message.channel.id);
		await message.channel.send("Restarting...");
		await client.db.client.set(client.user.id, "restartTimestamp", Date.now());
		process.exit(0);
	}
}