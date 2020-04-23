const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("yt-search");

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
        throw new Error("The URL must be a valid YouTube video URL!");  //smort stuff  yeah
      return play(client, message, args[0]); //this return should be out of if statement imo  not really, 
    }
    let res = await search(args.join(" "));
    let videos = res.videos.slice(0, 10);
    const requestMsg = await message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(
          `${message.author.tag} | Choose a Song`,
          message.author.displayAvatarURL()
        )
        .setColor(client.colors.info)
        .setFooter("Reply in 30 seconds with the option you choose")
        .setDescription(
          videos.map(
            (video, index) =>
              `**${index + 1}**: ${parseSongName(video.title, video.author.name)}`
          )
        )
    );
    const collector = message.channel.createMessageCollector(
      m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0
    );
    let collected = false;
    collector.once("collect", m => {
      collected = true;
      const song = videos[parseInt(m.content) - 1];
      requestMsg.delete();
      m.delete();
      play(client, message, song.url);
    });
    collector.once("end", (messages) => {
      if (!collected) {
        message.channel.stopTyping(true);
        requestMsg.delete();
        throw new Error("User request timed out");
      }
    })
  },
  async play(client, message, url) {
    const info = await ytdl.getInfo(url);
    if (info.player_response.videoDetails.isLiveContent) throw new Error("Cannot play live feed from YouTube");
    const song = { url, duration: parseInt(info.length_seconds), author: info.author.name, title: info.title, requestedBy: message.author.tag };
    if (!client.queue.has(message.guild.id)) {
      const connection = await message.member.voice.channel.join();
      message.guild.me.voice.setSelfDeaf(true);
      const dispatcher = await connection.play(
        ytdl(url, { filter: "audioonly", quality: "highestaudio" })
      );
      const serverQueue = {
        connection,
        dispatcher,
        voiceChannel: message.member.voice.channel,
        textChannel: message.channel,
        loop: "noloop",
        volume: 1.00,
        songs: [song]
      };
      dispatcher.setVolume(serverQueue.volume);
      client.queue.set(message.guild.id, serverQueue);
      message.channel.send(`:arrow_forward: Playing ${parseSongName(serverQueue.songs[0].title, serverQueue.songs[0].author)} requested by **${serverQueue.songs[0].requestedBy}**`);
      message.channel.stopTyping(true);
      dispatcher.on("finish", songFinished);
      async function songFinished() {
        const serverQueue = client.queue.get(message.guild.id);
        if (serverQueue.loop === "noloop") {
          serverQueue.songs.shift();
        } else if (serverQueue.loop === "all") {
          serverQueue.songs.push(serverQueue.songs.shift());
        } else if (serverQueue.loop === "shuffle") {
          serverQueue.songs.shift();
          serverQueue.songs = shuffle(serverQueue.songs);
        } else if (serverQueue.loop === "shuffleall") {
          serverQueue.songs = shuffle(serverQueue.songs);
        } else if (serverQueue.loop === "one") {
          serverQueue.songs.unshift(serverQueue.songs.shift());
        }
        if (!serverQueue.songs[0]) {
          message.guild.me.voice.channel.leave();
          client.queue.delete(message.guild.id);
          return serverQueue.textChannel.send(":white_check_mark: Nothing more to play, quitting voice channel");
        };
        if (serverQueue.voiceChannel.members.size <= 1) {
          message.guild.me.voice.channel.leave();
          client.queue.delete(message.guild.id);
          return serverQueue.textChannel.send(":octagonal_sign: Not playing music to anyone, quitting voice channel");
        }
        const newDispatcher = await serverQueue.connection.play(
          ytdl(serverQueue.songs[0].url, { filter: "audioonly", quality: "highestaudio" })
        );
        newDispatcher.on('finish', songFinished);
        newDispatcher.setVolume(serverQueue.volume);
        serverQueue.dispatcher = newDispatcher;
        serverQueue.textChannel.send(`:arrow_forward: Playing ${parseSongName(serverQueue.songs[0].title, serverQueue.songs[0].author)} requested by **${serverQueue.songs[0].requestedBy}**`);
        client.queue.set(message.guild.id, serverQueue);
      }
    } else {
      const serverQueue = client.queue.get(message.guild.id);
      serverQueue.songs.push(song);
      client.queue.set(message.guild.id, serverQueue);
      message.channel.send(`:white_check_mark: Added to queue ${parseSongName(song.title, song.author)} requested by **${song.requestedBy}**`);
      message.channel.stopTyping(true);
    }
  }
};

function shuffle(array) {
  const tempArray = Object.assign([], array);
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = tempArray[currentIndex];
    tempArray[currentIndex] = tempArray[randomIndex];
    tempArray[randomIndex] = temporaryValue;
  }

  return tempArray;
}
function parseSongName(title, author) {
  return title.includes(author) ? title.replace(author, `**${author}**`) : `**${title}** by *${author}*`
}