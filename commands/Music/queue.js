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
    return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setAuthor(`${message.author.tag} | Queue`, message.author.displayAvatarURL()).setTitle(`Number of songs: **${client.util.pluralify(message.guild.music.songs.length, "song")}**\nTotal queue duration: **${client.util.convertDuration(message.guild.music.songs.map(s => s.duration).reduce((acc, s) => acc + s))}**`).setDescription(songs.map((song, index) => (((page - 1) * 5) + (index + 1) === 1) ? `:arrow_forward: **${((page - 1) * 5) + (index + 1)}**: ${client.util.parseSongName(song)} : ${client.util.convertDuration(message.guild.music.duration)}` : `**${((page - 1) * 5) + (index + 1)}**: ${client.util.parseSongName(song)}`)).setFooter(`Page ${page} of ${Math.ceil(message.guild.music.songs.length / 5)}`));
  }
}