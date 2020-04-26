const Discord = require("discord.js");

const cancelKeywords = ["cancel", "abort"];

module.exports = {
	name: "search",
	aliases: ["yt-search", "playsearch"],
	desc: "Search for a song to be added to the queue",
	async exec(client, message, args) {
		if (!args[0])
			throw new Error("You need to provide a search string!");
		if (!message.guild.music.playing && !message.member.voice.channel) throw new Error("You are not in a voice channel!");
		if ((message.guild.music.songs.length + 1) > message.guild.music.queueLimit) throw new Error(`You can't add more than ${message.guild.music.queueLimit} songs into one queue!`);
		const songs = (await message.guild.music.searchSongs(args.join(" "))).slice(0, 10);
		const validWords = [...songs.map(s => s.title.toLowerCase()), ...cancelKeywords];
		const msg = await message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setFooter(`Use ${cancelKeywords.map(c => `"${c}"`).join(", ")} to cancel!`).setAuthor(`${message.author.tag} | Choose a song`, message.author.displayAvatarURL({ dynamic: true })).setDescription(songs.map((s, index) => `**${index + 1}**: ${client.util.parseSongName(s)}`).join("\n")));
		const filter = (m) => m.author.id === message.author.id && (isNaN(m.content) ? validWords.includes(m.content.toLowerCase()) : (parseInt(m.content) > 0 && parseInt(m.content) < songs.length));
		const collector = message.channel.createMessageCollector(filter, { time: 6e4 });
		let collected = false;
		collector.on('collect', m => {
			msg.delete();
			m.delete();
			collected = true;
			if (cancelKeywords.includes(m.content.toLowerCase())) {
				m.delete();
				msg.delete();
				message.channel.send("Aborted");
				return;
			}
			const song = isNaN(m.content) ? songs.find(s => s.title.toLowerCase() === m.content.toLowerCase()) : songs[parseInt(m.content) - 1];
			message.guild.music.startPlaying(song, message.author, message.channel, message.member.voice.channel);
		});
		collector.on('end', () => {
			if (!collected) {
				msg.delete();
				message.channel.send(`User timed out`);
				return;
			};
		})
	}
}