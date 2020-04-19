module.exports = {
  name: "ping",
  aliases: ["pong"],
  desc: "Check the ping of this bot",
  async exec(client, message, args) {
    const msg = await message.channel.send(":ping_pong: Pinging...");
    return msg.edit(`:ping_pong: Pong! Gateway: ${client.util.convertMs(client.ws.ping)}, HTTP API: ${client.util.convertMs((Date.now() - msg.createdTimestamp)/2)}`);
  }
}