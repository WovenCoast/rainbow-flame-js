const Discord = require('discord.js');

module.exports = {
  name: "queue",
  aliases: ["q"],
  desc: "View the queue of music playback",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    let songs = message.guild.music.songs;
    let page = 1;
    if (message.guild.music.songs.length > 5) {
      if (args[0] && !isNaN(args[0])) page = parseInt(args[0]);
      if (Math.ceil(message.guild.music.songs.length / 5) < page) throw new Error(`Cannot view page ${page} from ${client.util.pluralify(Math.ceil(message.guild.music.songs.length / 5), "valid page")}!`);
      songs = message.guild.music.songs.slice((page - 1) * 5, page * 5);
    }
    return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.author.tag} | Queue`, message.author.displayAvatarURL()).setTitle(`Now playing: ${parseSongName(message.guild.music.songs[0])}, playhead at ${client.util.convertDuration(message.guild.music.duration)}`).setDescription(songs.map((song, index) => `**${((page - 1) * 5) + (index + 1)}**: ${client.util.parseSongName(song)}`)).setFooter(`Page ${page} of ${Math.ceil(message.guild.music.songs.length / 5)}`));
  }
}
function parseSongName(title, author) {
  return title.includes(author) ? title.replace(author, `**${author}**`) : `**${title}** by *${author}*`
}