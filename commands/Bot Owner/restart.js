module.exports = {
	name: "restart",
	aliases: [],
	desc: "Restart the bot",
	async exec(client, message, args) {
		await client.db.client.set(client.user.id, "restartInvokedChannel", message.channel.id);
		await message.channel.send("Restarting...");
		await client.db.client.set(client.user.id, "restartTimestamp", Date.now());
		process.exit(0);
	}
}