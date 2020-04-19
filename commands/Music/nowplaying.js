const Discord = require('discord.js');

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  desc: "See information about the now playing song",
  async exec(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    const song = serverQueue.songs[0];
    return message.channel.send(`:arrow_forward: Now Playing: ${parseSongName(song.title, song.author)} requested by **${song.requestedBy}**`)
  }
}
function parseSongName(title, author) {
  return title.includes(author) ? title.replace(author,`**${author}**`) : `**${title}** by *${author}*` 
}