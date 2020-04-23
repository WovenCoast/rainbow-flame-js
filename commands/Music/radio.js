const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("yt-search");

const { play } = require('./play');

const cancelKeywords = ["cancel", "abort"];
const playlists = {
	"Lofi": [
		"Snowman WYS",
		"You Sound Like A Dukc Lofi",
		"Death Bed Kets Formal Chicken",
		"Both of Us Idealism",
		"Eternal Youth (Lofi)",
		"Autumn Leaves Axian",
		"with u idealism",
		"Lofi rain by Lee",
		"unthinkable idealism",
		"Chill Study Beats 2 . Instrumental and Jazz",
		"lonely idealism",
		"Nighttime Ramen",
		"C H I L L V I B E S",
		"Alone time purple cat",
		"Take me Back WYS",
		"Nautilus WYS",
		"lofi study mix for homework",
		"Conforting You WYS",
		"Satellite WYS",
		"Missing Earth Hoogway",
		"You cocobona",
		"pale Moon Dr. Dundiff",
		"Puddle E I S U",
		"Midnight Snack Purple Cat",
		"Night Owls sleepermane"
	]
}

module.exports = {
	name: "radio",
	aliases: ["rad"],
	desc: "Play a playlist that we have chosen for you",
	usage: "{prefix}radio",
	cooldown: 3,
	async exec(client, message, args) {
		if (!message.member.voice.channel)
			throw new Error("You are not in a voice channel!");
		if (args[0]);
		let pl = Object.keys(playlists);
		const playlist = Object.keys(playlists).map(p => p.toLowerCase()).indexOf(args.join(" ").toLowerCase());
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
								`**${index + 1}**: ${playlist} - ${client.util.pluralify(playlists[playlist].length, "song")}`
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
				addSongs(client, message, playlists[Object.keys(playlists)[isNaN(m.content) ? pl.map(p => p.toLowerCase()).indexOf(m.content.toLowerCase()) : (parseInt(m.content) - 1)]]);
			});
			collector.once("end", (messages) => {
				if (!collected) {
					message.channel.stopTyping(true);
					requestMsg.delete();
					throw new Error("User request timed out");
				}
			})
		} else {
			addSongs(client, message, Object.values(playlists)[playlist]);
		}
	}
};

async function addSongs(client, message, songs) {
	const url = (await search(songs[0])).videos[0].url;
	await play(client, message, url);
	const serverQueue = client.queue.get(message.guild.id);
	songs.slice(1, songs.length).forEach(async s => {
		const searchResults = await search(s);
		const info = await ytdl.getInfo(searchResults.videos[0].url);
		const song = { url: searchResults.videos[0].url, duration: parseInt(info.length_seconds), author: info.author.name, title: info.title, requestedBy: message.author.tag };
		serverQueue.songs.push(song);
	});
	serverQueue.loop = "shuffleall";
	message.channel.send(`:white_check_mark: Successfully added the playlist! Check the songs using \`${message.prefix}queue\``);
}