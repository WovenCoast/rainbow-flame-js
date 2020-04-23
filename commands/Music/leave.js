module.exports = {
  name: "leave",
  aliases: ["fuckoff"],
  desc: "Leave the voice channel",
  async exec(client, message, args) {
    if (!message.guild.me.voice.channel) throw new Error("I am not connected to any channel of this guild!");
    message.guild.me.voice.channel.leave();
    message.guild.music.resetValues();
    return message.channel.send(":white_check_mark: Left the voice channel successfully!");
  }
}