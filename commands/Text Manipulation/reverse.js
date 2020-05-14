module.exports = {
  name: "reverse",
  aliases: [],
  desc: "Reverse any message you want!",
  async exec(client, message, args) {
    await message.channel.send(args.join(" ").split("").reverse().join(""));
    return;
  },
};
