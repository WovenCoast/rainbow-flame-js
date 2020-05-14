module.exports = {
  name: "say",
  aliases: [],
  desc: "Make me say any message you want!",
  usage: "{prefix}say <...text:string>",
  async exec(client, message, args) {
    await message.channel.send(message.author.tag + ": " + args.join(" "));
    await message.delete();
    return;
  },
};
