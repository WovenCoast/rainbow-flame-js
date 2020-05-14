const Discord = require("discord.js");

module.exports = {
  name: "message",
  async exec(client, message) {
    if (
      ["bots are evolving", "evolving bots"].some((v) =>
        message.content.includes(v)
      )
    )
      message.channel.send(
        client.util.getRandom([
          "Bots are clearly evolving.",
          "You don't wanna know how we evolve.",
        ])
      );
  },
};
