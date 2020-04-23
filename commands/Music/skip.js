module.exports = {
  name: "skip",
  aliases: ["next"],
  desc: "Skip a playback song",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    let count = 1;
    if (args[0] && !isNaN(args[0])) count = parseInt(args[0]);
    if (count > 32768) throw new Error("The maximum amount of songs skippable is 32768 songs!");
    for (let i = 0; i < count - 1; i++) {
      if (message.guild.music.loop === "noloop") {
        message.guild.music.songs.shift();
      } else if (message.guild.music.loop === "all") {
        message.guild.music.songs.push(message.guild.music.songs.shift());
      } else if (message.guild.music.loop === "shuffle") {
        message.guild.music.songs.shift();
        message.guild.music.songs = client.util.shuffle(message.guild.music.songs);
      } else if (message.guild.music.loop === "shuffleall") {
        message.guild.music.songs = client.util.shuffle(message.guild.music.songs);
      } else if (message.guild.music.loop === "one") {
        message.guild.music.songs.unshift(message.guild.music.songs.shift());
      }
      if (!message.guild.music.songs[0]) {
        count = i;
        break;
      };
    }
    message.guild.music.connection.dispatcher.end("finish");
    return message.channel.send(`:white_check_mark: Skipped **${client.util.pluralify(count, "song")}**!`)
  }
}