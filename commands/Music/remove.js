module.exports = {
	name: "remove",
	aliases: ["rm"],
	desc: "Remove a song from the queue",
	usage: "{prefix}remove <songIndex:int>",
	async exec(client, message, args) {
		const serverQueue = client.queue.get(message.guild.id);
		if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
		if (!args[0]) throw new Error("You need to state a song index to remove!");
		if (isNaN(args[0])) throw new Error("You need to input a number as the second argument!");
		if (parseInt(args[0]) <= 0) throw new Error("Cannot remove currently playing song");
		const songIndex = parseInt(args[0]);
		const removedSong = serverQueue.songs[songIndex];
		serverQueue.songs.splice(songIndex, 1);
		return message.channel.send(`:white_check_mark: Successfully removed ${parseSongName(removedSong.title, removedSong.author)} requested by **${removedSong.requestedBy}**`);
	}
}