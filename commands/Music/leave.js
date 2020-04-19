module.exports = {
  name: "leave",
  aliases: ["fuckoff"],
  desc: "Leave the voice channel",
  async exec(client, message, args) {
    if (!message.guild.me.voice.channel) throw new Error("I am not connected to any channel of this guild!");
    message.guild.me.voice.channel.leave();
    client.queue.delete(message.guild.id);
    return message.channel.send(":white_check_mark: Left the voice channel successfully!");
  }
}