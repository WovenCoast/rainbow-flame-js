const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
  name: "play",
  aliases: ["p"],
  desc: "Play a song of your choice from YouTube",
  usage: "{prefix}play <songname:string>",
  cooldown: 3,
  async exec(client, message, args) {
    if (!args[0])
      throw new Error("You need to provide a search string or a YouTube URL!");
    if (!message.member.voice.channel)
      throw new Error("You are not in a voice channel!");
    if (args[0].startsWith("http")) {
      if (!(await ytdl.validateURL(args[0])))
        throw new Error("The URL must be a valid YouTube video URL!");
    }
    const song = await message.guild.music.searchSong(args.join(" "), message.author.tag);
    message.guild.music.startPlaying(song, message.author, message.channel, message.member.voice.channel);
  },
};