module.exports = {
	name: "remove",
	aliases: ["rm"],
	desc: "Remove a song from the queue",
	usage: "{prefix}remove <songIndex:int>",
	async exec(client, message, args) {
		if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
		if (!args[0]) throw new Error("You need to state a song index to remove!");
		const songIndex = isNaN(args[0]) ? message.guild.music.songs.map(s => s.title.toLowerCase()).indexOf(args.join(" ").toLowerCase()) : parseInt(args[0]);
		if (songIndex <= 1 || songIndex >= message.guild.music.songs.length) throw new Error("You cannot a non existent song!");
		const removedSong = message.guild.music.songs[songIndex];
		message.guild.music.removeSong(songIndex);
		return message.channel.send(`:white_check_mark: Successfully removed ${parseSongName(removedSong.title, removedSong.author)} requested by **${removedSong.requestedBy}**`);
	}
}