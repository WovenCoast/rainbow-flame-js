const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'cat',
  aliases: [],
  desc: "Show an image of a cat",
  async exec(client, message, args) {
    return message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.info).setTitle("Meow!").setImage((await axios.get('https://api.thecatapi.com/v1/images/search')).data[0].url));
  }
}