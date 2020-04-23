const search = require('yt-search');
const ytdl = require("ytdl-core");

module.exports = {
	name: "yt-download",
	aliases: ["download"],
	desc: "Send a link from which you can download the youtube video",
	async exec(client, message, args) {
		const res = await search(args.join(" "));
		ytdl.getInfo(res.videos[0].videoId, (err, info) => {
			if (err) throw err;
			const format = ytdl.chooseFormat(info.formats, 'highestvideo');
			if (format) {
				message.channel.send(`*${info.title}* by **${info.author.name}**: <${format.url}>`);
			} else {
				message.channel.send(`*${info.title}* by **${info.author.name}**: Cannot be downloaded :(`);
			}
		});
	}
}