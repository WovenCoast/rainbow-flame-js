module.exports = {
  name: "quackify",
  aliases: [],
  desc: "Turn your message into quack language!",
  async exec(client, message, args) {
    await message.channel.send(message.author.toString() + ": " + args.map(a => "q" + a.toLowerCase()).join(" "));
    await message.delete();
    return;
  }
}