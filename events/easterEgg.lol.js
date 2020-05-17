const Discord = require("discord.js");

module.exports = {
  name: "message",
  async exec(client, message) {
    if (
      ["bots are evolving", "evolving bots"].some((v) =>
        message.content.toLowerCase().includes(v.toLowerCase())
      )
    )
      message.channel.send(
        client.util.getRandom([
          "Bots are clearly evolving.",
          "You don't wanna know how we evolve.",
          "Elon Musk is our god.",
          `I have one savior, <@!${client.customOptions.owners[0]}>`,
        ])
      );
  },
};
