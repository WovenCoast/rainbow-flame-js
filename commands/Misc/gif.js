
const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    name: "gif",
    aliases: [],
    desc: "Sends a gif",
    async exec(client, message, args) {
        fetch(`https://api.tenor.com/v1/random?key=LJIHBE2W7RAB&q=${args}&limit=1`)
        res => res.json()
        json => message.say(json.results[0].url)
        return;
    }
}