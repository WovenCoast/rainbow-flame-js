const Discord = require('discord.js');

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  desc: "See information about the now playing song",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    const song = message.guild.music.songs[0];
    return message.channel.send(`:arrow_forward: Now Playing: ${client.util.parseSongName(song.title, song.author)}, playhead at ${client.util.convertDuration(message.guild.music.duration)}`)
  }
}