
const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    name: "gif",
    aliases: [],
    desc: "Sends a gif",
    async exec(client, message, args) {
        fetch(`https://api.tenor.com/v1/random?key=LJIHBE2W7RAB&q=${args}&limit=1`)
            .then(res => res.json())
            .then(json => message.say(json.results[0].url))
            .catch(e => {
                message.say('Failed to find a gif that matched your query');
                return console.error(e);
            });
        return;
    }
}