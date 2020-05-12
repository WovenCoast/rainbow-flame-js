const Discord = require("discord.js");

const cancelKeywords = ["cancel", "abort"];

module.exports = {
  name: "radio",
  aliases: ["rad"],
  desc: "Play a playlist that we have chosen for you",
  usage: "{prefix}radio",
  cooldown: 3,
  disabled: true,
  async exec(client, message, args) {
    if (!message.member.voice.channel)
      throw new Error("You are not in a voice channel!");
    let pl = Object.keys(client.playlists);
    const playlists = Object.assign({}, client.playlists);
    const playlist = Object.keys(playlists)
      .map((p) => p.toLowerCase())
      .indexOf(args.join(" ").toLowerCase());
    if (playlist === -1) {
      const requestMsg = await message.channel.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setAuthor(
            `${message.author.tag} | Choose a Playlist`,
            message.author.displayAvatarURL()
          )
          .setColor(client.colors.info)
          .setFooter(
            `Reply in 30 seconds with the option you choose, use ${cancelKeywords
              .map((c) => `\`${c}\``)
              .join(", ")} to cancel!`
          )
          .setDescription(
            await Promise.all(
              pl.map(async (playlist, index) => {
                playlists[playlist] = (
                  await Promise.all(
                    playlists[playlist].map(
                      async (s) => await message.guild.music.searchSong(s)
                    )
                  )
                ).filter((e) => e !== undefined);
                return `**${index + 1}**: ${playlist} - ${client.util.pluralify(
                  playlists[playlist].length,
                  "song"
                )} : ${client.util.convertDuration(
                  playlists[playlist]
                    .map((s) => s.duration)
                    .reduce((acc, s) => acc + s)
                )}`;
              })
            )
          )
      );
      const collector = message.channel.createMessageCollector(
        (m) =>
          [...pl, ...cancelKeywords]
            .map((p) => p.toLowerCase())
            .includes(m.content.toLowerCase()) ||
          (!isNaN(m.content) && m.content < pl.length + 1 && m.content > 0)
      );
      let collected = false;
      collector.once("collect", (m) => {
        collected = true;
        requestMsg.delete();
        m.delete();
        if (cancelKeywords.includes(m.content.toLowerCase()))
          return message.channel.send("Aborted");
        addSongs(
          client,
          message,
          playlists[
            Object.keys(playlists)[
              isNaN(m.content)
                ? pl
                    .map((p) => p.toLowerCase())
                    .indexOf(m.content.toLowerCase())
                : parseInt(m.content) - 1
            ]
          ]
        );
      });
      collector.once("end", (messages) => {
        if (!collected) {
          message.channel.stopTyping(true);
          requestMsg.delete();
          throw new Error("User request timed out");
        }
      });
    } else {
      if (
        message.guild.music.songs.length + songs.length >
        message.guild.music.queueLimit
      )
        return message.channel.send(
          `:octagonal_sign: You cannot add a playlist that will make the queue bigger than its limit of ${message.guild.music.queueLimit} songs!`
        );
      await Promise.all(
        pl.map(async (playlist, index) => {
          playlists[playlist] = (
            await Promise.all(
              playlists[playlist].map(
                async (s) => await message.guild.music.searchSong(s)
              )
            )
          ).filter((e) => e !== undefined);
          return undefined;
        })
      );
      addSongs(client, message, playlists[Object.keys(playlists)[playlist]]);
    }
  },
};

async function addSongs(client, message, songs) {
  if (
    message.guild.music.songs.length + songs.length >
    message.guild.music.queueLimit
  )
    return message.channel.send(
      `:octagonal_sign: You cannot add a playlist that will make the queue bigger than its limit of ${message.guild.music.queueLimit} songs!`
    );
  const start = client.util.randomValue(0, songs.length);
  await message.guild.music.startPlaying(
    songs[start],
    message.author,
    message.channel,
    message.member.voice.channel
  );
  songs.forEach(async (s, index) => {
    if (index === start) return;
    s.requestedBy = message.author.tag;
    message.guild.music.songs.push(s);
  });
  message.guild.music.loop = "shuffleall";
  message.channel.send(
    `:white_check_mark: Successfully added the playlist! Check the songs using \`${message.prefix}queue\``
  );
}
