const search = require('yt-search');
const ytdl = require("ytdl-core");
const tinyurl = require('tinyurl');

module.exports = {
	name: "audiodownload",
	aliases: ["adownload","mp3"],
	desc: "Send a link from which you can download the audio from a YouTube video",
	async exec(client, message, args) {
		const res = await search(args.join(" "));
		const info = await ytdl.getInfo(res.videos[0].videoId)
		const format = ytdl.chooseFormat(info.formats.mp3, 'audioonly');
		if (format) {
			const shortenedUrl = await tinyurl.shorten(format.url);
			message.channel.send(`*${info.title}* by **${info.author.name}**: <${shortenedUrl}>`);
		} else {
			message.channel.send(`*${info.title}* by **${info.author.name}**: Cannot be downloaded :(`);
		}
	}
}