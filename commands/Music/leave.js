module.exports = {
  name: "leave",
  aliases: ["fuckoff"],
  desc: "Leave the voice channel",
  async exec(client, message, args) {
    if (!message.guild.me.voice.channel) throw new Error("I am not connected to any channel of this guild!");
    if (!message.member.voice.channel) throw new Error("You need to be connected to a voice channel!");
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) throw new Error("You need to be in the same channel as I am!");
    message.guild.me.voice.channel.leave();
    message.guild.music.resetValues();
    return message.channel.send(":white_check_mark: Left the voice channel successfully!");
  }
}