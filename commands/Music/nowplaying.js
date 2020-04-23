const Discord = require('discord.js');

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  desc: "See information about the now playing song",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    const song = message.guild.music.songs[0];
    return message.channel.send(`:arrow_forward: Now Playing: ${parseSongName(song.title, song.author)} requested by **${song.requestedBy}**: ${client.util.convertDuration(message.guild.music.duration)} / ${client.util.convertDuration(song.duration)}`)
  }
}
function parseSongName(title, author) {
  return title.includes(author) ? title.replace(author, `**${author}**`) : `**${title}** by *${author}*`
}