const Discord = require('discord.js');

module.exports = {
  name: "queue",
  aliases: ["q"],
  desc: "View the queue of music playback",
  async exec(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    let songs = serverQueue.songs;
    let page = 1;
    if (serverQueue.songs.length > 5) {
      if (args[0] && !isNaN(args[0])) page = parseInt(args[0]);
      if (Math.round(serverQueue.songs.length / 5) < page) throw new Error(`Cannot view page ${page} from ${client.util.pluralify(Math.round(serverQueue.songs.length / 5), "valid page")}!`);
      songs = serverQueue.songs.slice((page - 1) * 5, page * 5);
    }
    return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.author.tag} | Queue`, message.author.displayAvatarURL()).setTitle(`Now playing: ${parseSongName(serverQueue.songs[0].title, serverQueue.songs[0].author)}`).setDescription(songs.map((song, index) => `**${((page - 1) * 5) + (index + 1)}**: ${parseSongName(song.title, song.author)}`)).setFooter(`Page ${page} of ${Math.round(serverQueue.songs.length / 5)}`));
  }
}
function parseSongName(title, author) {
  return title.includes(author) ? title.replace(author, `**${author}**`) : `**${title}** by *${author}*`
}