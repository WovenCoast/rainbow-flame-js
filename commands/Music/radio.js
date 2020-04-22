const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("yt-search");

const playlists = {
	"The Ducks": [
		"The Duck Song",
		"The Duck Song 2",
		"The Duck Song 3",
		"The Duck Song 4",
		"The Duck Song 5"
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
		let pl = Object.keys(playlists);
		const requestMsg = await message.channel.send(
			new Discord.MessageEmbed()
				.setTimestamp()
				.setAuthor(
					`${message.author.tag} | Choose a Playlist`,
					message.author.displayAvatarURL()
				)
				.setColor(client.colors.info)
				.setFooter("Reply in 30 seconds with the option you choose")
				.setDescription(
					pl.map(
						(playlist, index) =>
							`**${index + 1}**: ${playlist}`
					)
				)
		);
		const collector = message.channel.createMessageCollector(
			m => !isNaN(m.content) && m.content < pl.length + 1 && m.content > 0
		);
		let collected = false;
		collector.once("collect", m => {
			collected = true;
			requestMsg.delete();
			m.delete();
			addSongs(client, message, playlists[Object.keys(playlists)[parseInt(m.content) - 1]]);
		});
		collector.once("end", (messages) => {
			if (!collected) {
				message.channel.stopTyping(true);
				requestMsg.delete();
				throw new Error("User request timed out");
			}
		})
	}
};

async function addSongs(client, message, songs) {
	const url = (await search(songs[0])).videos[0].url;
	await play(client, message, url);
	const serverQueue = client.queue.get(message.guild.id);
	songs.slice(1, songs.length).forEach(async s => {
		const info = await ytdl.getInfo((await search(s)).videos[0].url);
		const song = { url, duration: parseInt(info.length_seconds), author: info.author.name, title: info.title, requestedBy: message.author.tag };
		serverQueue.songs.push(song);
	});
	message.channel.send(`:white_check_mark: Successfully added the playlist! Check the songs using \`${message.prefix}queue\``);
}

async function play(client, message, url) {
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