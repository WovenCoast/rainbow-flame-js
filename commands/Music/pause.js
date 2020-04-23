module.exports = {
  name: "pause",
  aliases: ["resume"],
  desc: "Pause/Resume music playback",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    if (message.guild.music.connection.dispatcher.paused) {
      message.guild.music.connection.dispatcher.resume();
      return message.channel.send(":white_check_mark: Resumed the music!");
    } else {
      message.guild.music.connection.dispatcher.pause();
      return message.channel.send(":white_check_mark: Paused the music!");
    }
  }
}