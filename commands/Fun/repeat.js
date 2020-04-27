module.exports = {
  name: "repeat",
  aliases: ["spam"],
  desc: "Repeat a message a certain amount of time",
  usage: "{prefix}repeat <ctr:number> <...message:string>",
  async exec(client, message, args) {
    if (isNaN(args[0]))
      throw new Error(`\`${args[0]}\` is not a valid amount!`);
    if (parseInt(args[0]) > 1000 || parseInt(args[0]) < 0)
      throw new Error("You need to specify a value between 0 and 1000!");
    const x = args.slice(1, args.length).join(" ").length;
    if (
      !message.member.hasPermission("MANAGE_MESSAGES") &&
      parseInt(args[0]) > 50
    )
      throw new Error(
        "Only people who can delete the messages can send over 50 repeats!"
      );
    const str = (args.slice(1, args.length).join(" ") + " ").repeat(
      parseInt(args[0])
    );
    const y = 2000;
    return await Promise.all(
      client.util.chunk((y / x - 1) * x, str).map(s => message.channel.send(s))
    );
  }
};
