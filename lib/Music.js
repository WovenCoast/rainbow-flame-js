const Client = require("./Client");
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('yt-search');

/**
 * @typedef Song
 * 
 * @property {string} url The url of this YouTube video
 * @property {number} duration The duration of the video, in seconds
 * @property {Discord.GuildMember} requestedBy The member who requested this song
 */
class Music {
	/**
	 * An enhanced music player for RainbowFlame
	 * @param {Client} client The client associated with this music player
	 * @param {Discord.Guild} guild The guild that this music player is playing to
	 */
	constructor(client, guild) {
		/**
		 * The client associated with this music player
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * The guild that this music player is playing to
		 * @type {Discord.Guild}
		 */
		this.guild = guild;
		/**
		 * The songs that this music player will play
		 * @type {Array<Song>}
		 */
		this.songs = [];
		/**
		 * A boolean that will start if the player is playing
		 * @type {boolean}
		 */
		this.playing = false;
		/**
		 * The voice connection if connected to this guild
		 * @type {Discord.VoiceConnection}
		 */
		this.connection = null;
		/**
		 * The channel that music updates should be sent to
		 */
		this.musicUpdatesChannel = null;
		/**
		 * The volume that this player would play at
		 * @type {number}
		 */
		this.volume = 1.0;
	}

	/**
	 * Search for a song in YouTube
	 * @param {string} query The search string with which the bot will search YouTube
	 * @param {Discord.GuildMember} member The member which requested the song
	 * @returns {Array<Song>} An array of songs
	 */
	async searchSong(query, member) {
		const res = await search(query);
		return res.videos.map(s => {
			return { url: s.url, duration: s.seconds, author: s.author.name, title: s.title, requestedBy: member.user.tag };
		})
	}

	/**
	 * Start playing a song
	 * @param {Song} song The song that playback should start with
	 * @param {Discord.TextChannel} textChannel The text channel that all the music updates should go to
	 * @param {Discord.VoiceChannel} voiceChannel The voice channel that the bot should connect to and start playing
	 */
	async startPlaying(song, textChannel, voiceChannel) {
		if (this.playing) return this.addSong(song);
		this.songs.push(song);
		if (!this.guild.voice) {
			await voiceChannel.join();
		}
		this.connection = this.guild.voice.connection;
		this.musicUpdatesChannel = textChannel;
		const dispatcher = await this.connection.play(ytdl(this.songs[0].url), { filter: "audioonly", quality: "highestaudio" });
		dispatcher.on('finish', this._finish);
	}

	/**
	 * Add a song to the queue, will start if queue not provided
	 * @param {Song} song The song that needs to be added to the queue
	 */
	addSong(song) {
		return this.songs.push(song);
	}

	/**
	 * When a song is finished playing
	 * @private	
	 */
	async _finish() {
		if (this.loop === "noloop") {
			this.songs.shift();
		} else if (this.loop === "all") {
			this.songs.push(this.songs.shift());
		} else if (this.loop === "shuffle") {
			this.songs.shift();
			this.songs = shuffle(this.songs);
		} else if (this.loop === "shuffleall") {
			this.songs = shuffle(this.songs);
		} else if (this.loop === "one") {
			this.songs.unshift(this.songs.shift());
		}
		if (!this.songs[0] || serverQueue.voiceChannel.members.size <= 1) {
			if (!this.songs[0]) {
				this.musicUpdatesChannel.send(":white_check_mark: Nothing more to play, quitting voice channel");
			} else if (serverQueue.voiceChannel.members.size <= 1) {
				this.musicUpdatesChannel.send(":octagonal_sign: Not playing music to anyone, stopping playback");
			}
			this.resetValues();
			return;
		};
		const newDispatcher = await this.connection.play(
			ytdl(this.songs[0].url, { filter: "audioonly", quality: "highestaudio" })
		);
		newDispatcher.on('finish', this._finish);
		newDispatcher.setVolume(this.volume);
	}

	/**
	 * Get the duration that the current playing song has been playing for, in seconds
	 */
	get duration() {
		return this.connection ? this.connection.dispatcher.streamTime / 1000 : null;
	}

	/**
	 * Remove a song from the queue
	 * @param {number} index The index of the song that needs to be removed
	 */
	removeSong(index) {
		if (this.songs.length >= index) return;
		this.songs = this.songs.splice(index, 1);
	}

	/**
	 * Reset the values after the bot has quit the voice channel
	 */
	resetValues() {
		this.guild.voice.leave();
		this.playing = false;
		this.musicUpdatesChannel = null;
		this.connection = null;
		this.songs = [];
		this.volume = 0;
	}
}

module.exports = Music;