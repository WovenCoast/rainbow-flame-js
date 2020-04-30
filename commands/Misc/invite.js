module.exports = {
	name: "invite",
	aliases: ["i"],
	desc: "Get the invite link for this bot",
	async exec(client, message, args) {
		message.channel.send(`Feel free to invite me to another server using this invite link <https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot>`);
	}
}