module.exports = {
  name: "repeat",
  aliases: ["spam"],
  desc: "Repeat a message a certain amount of time",
  usage: "{prefix}repeat <ctr:number> <...message:string>",
  async exec(client, message, args) {
    if (isNaN(args[0]))
      throw new Error(`\`${args[0]}\` is not a valid amount!`);
    const x = args.slice(1, args.length).join(" ").length + 1;
    if (parseInt(args[0]) * x > 10000)
      throw new Error(
        "The string that it can make entirely is 10000 characters maximum!"
      );
    if (parseInt(args[0]) > 1000 || parseInt(args[0]) < 0)
      throw new Error("You need to specify a value between 0 and 1000!");
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
    return await Promise.all(
      client.util
        .chunk((Math.ceil(2000 / x) - 1) * x, str)
        .map((s) => message.channel.send(s))
    );
  },
};
