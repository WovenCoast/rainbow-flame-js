const Discord = require("discord.js");

module.exports = {
  name: "purge",
  aliases: ["prune"],
  desc: "Purge a certain amount of messages from a channel",
  async exec(client, message, args) {
    if (!message.member.hasPermission(["MANAGE_MESSAGES"]))
      throw new Error(
        "You need to have the `MANAGE_MESSAGES` permission to be able to purge a channel!"
      );
    if (!args[0])
      throw new Error("You need to specify how many messages I should purge!");
    if (isNaN(args[0]))
      throw new Error("You need to give a number value of messages to delete!");
    const messages = await message.channel.bulkDelete(parseInt(args[0]) + 1);
    const msg = await message.channel.send(
      `:white_check_mark: Successfully purged **${messages.size}** messages!`
    );
    await client.util.delay(2000);
    return msg.delete();
  },
};
