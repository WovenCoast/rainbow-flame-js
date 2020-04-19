module.exports = {
  name: "pause",
  aliases: ["resume"],
  desc: "Pause/Resume music playback",
  async exec(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    if (serverQueue.dispatcher.paused) {
      serverQueue.dispatcher.resume();
      return message.channel.send(":white_check_mark: Resumed the music!");
    } else {
      serverQueue.dispatcher.pause();
      return message.channel.send(":white_check_mark: Paused the music!");
    }
  }
}