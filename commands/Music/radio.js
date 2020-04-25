const Discord = require("discord.js");

const cancelKeywords = ["cancel", "abort"];

module.exports = {
	name: "radio",
	aliases: ["rad"],
	desc: "Play a playlist that we have chosen for you",
	usage: "{prefix}radio",
	cooldown: 3,
	async init(client) {
		Object.keys(client.playlists).forEach(playlistKey => {
			const playlist = client.playlists[playlistKey];
			playlist.forEach(async (song, index) => {
				client.playlists[playlistKey][index] = (await client.guilds.cache.first().music.searchSongs(song, { user: { tag: "" } }))[0];
			});
		});
	},
	async exec(client, message, args) {
		if (!message.member.voice.channel)
			throw new Error("You are not in a voice channel!");
		let pl = Object.keys(client.playlists);
		const playlist = Object.keys(client.playlists).map(p => p.toLowerCase()).indexOf(args.join(" ").toLowerCase());
		if (playlist === -1) {
			const requestMsg = await message.channel.send(
				new Discord.MessageEmbed()
					.setTimestamp()
					.setAuthor(
						`${message.author.tag} | Choose a Playlist`,
						message.author.displayAvatarURL()
					)
					.setColor(client.colors.info)
					.setFooter(`Reply in 30 seconds with the option you choose, use ${cancelKeywords.map(c => `\`${c}\``).join(", ")} to cancel!`)
					.setDescription(
						pl.map(
							(playlist, index) =>
								`**${index + 1}**: ${playlist} - ${client.util.pluralify(client.playlists[playlist].length, "song")} : ${client.util.convertDuration(client.playlists[playlist].map(s => s.duration).reduce((acc, s) => acc + s))}`
						)
					)
			);
			const collector = message.channel.createMessageCollector(
				m => ([...pl, ...cancelKeywords].map(p => p.toLowerCase()).includes(m.content.toLowerCase())) || (!isNaN(m.content) && m.content < pl.length + 1 && m.content > 0)
			);
			let collected = false;
			collector.once("collect", m => {
				collected = true;
				requestMsg.delete();
				m.delete();
				if (cancelKeywords.includes(m.content.toLowerCase())) return message.channel.send("Aborted");
				addSongs(client, message, client.playlists[Object.keys(client.playlists)[isNaN(m.content) ? pl.map(p => p.toLowerCase()).indexOf(m.content.toLowerCase()) : (parseInt(m.content) - 1)]]);
			});
			collector.once("end", (messages) => {
				if (!collected) {
					message.channel.stopTyping(true);
					requestMsg.delete();
					throw new Error("User request timed out");
				}
			})
		} else {
			addSongs(client, message, Object.values(client.playlists[playlist]));
		}
	}
};

async function addSongs(client, message, _s) {
	const songs = _s.map(song => {
		song.requestedBy = message.author.tag;
		return song;
	})
	const start = client.util.randomValue(0, songs.length);
	await message.guild.music.startPlaying(songs[0], message.channel, message.member.voice.channel);
	songs.forEach(async (s, index) => {
		if (index === start) return;
		message.guild.music.songs.push(s);
	});
	message.guild.music.loop = "shuffleall";
	message.channel.send(`:white_check_mark: Successfully added the playlist! Check the songs using \`${message.prefix}queue\``);
}