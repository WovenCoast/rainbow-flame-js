module.exports = {
    name: "daily",
    aliases: [],
    desc: "You get UC every day",
    usage: "???",
    async exec(client, message, args) {
        await client.db.member._set(message.guild.id + message.author.id, "wallet", (await client.db.member.get(message.guild.id + message.author.id, "wallet")) + 100);

    }
  }