module.exports = {
  name: "reverse",
  aliases: ["esrever"],
  desc: "Reverse any message you want!",
  usage: "{prefix}reverse racecar",
  async exec(client, message, args) {
    await message.channel.send(args.join(" ").split("").reverse().join(""));
    return;
  },
};
