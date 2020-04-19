const Discord = require("discord.js");
const axios = require("axios");

const subreddits = [
  "crappydesign",
  "dankmemes",
  "me_irl",
  "wholesomememes",
  "memeeconomy",
  "adviceanimals",
  "comedycemetery",
  "memes",
  "prequelmemes",
  "terriblefacebookmemes",
  "pewdiepiesubmissions",
  "funny",
  "chucknorris"
];

module.exports = {
  name: "meme",
  aliases: [],
  desc: "Get a meme from reddit",
  async exec(client, message, args) {
    message.channel.startTyping();
    const subreddit = subreddits[client.util.randomValue(0, subreddits.length)];
    const data = (await axios.get(
      `https://www.reddit.com/r/${subreddit}.json?sort=top&t=day&limit=50`
    )).data.data;
    const safeMemes = data.children.filter(d => !d.data.over_18);
    const randomMeme =
      safeMemes[client.util.randomValue(0, safeMemes.length)].data;
    const meme = {
      title: randomMeme.title,
      url: randomMeme.url,
      author: randomMeme.author,
      subreddit: randomMeme.subreddit,
      created: convertTime(parseInt(randomMeme.created))
    };
    message.channel.stopTyping(true);
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(meme.title)
        .setColor(client.colors.info)
        .setImage(meme.url)
        .setFooter(`${meme.author} in r/${meme.subreddit}`)
        .setTimestamp(new Date(meme.created))
    );
  }
};

function convertTime(unixtime) {
  var u = new Date(unixtime * 1000);

  return (
    u.getUTCFullYear() +
    "-" +
    ("0" + u.getUTCMonth()).slice(-2) +
    "-" +
    ("0" + u.getUTCDate()).slice(-2) +
    " " +
    ("0" + u.getUTCHours()).slice(-2) +
    ":" +
    ("0" + u.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + u.getUTCSeconds()).slice(-2) +
    "." +
    (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
  );
}
