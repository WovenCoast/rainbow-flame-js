module.exports = {
  name: "repeat",
  aliases: ["spam"],
  desc: "Repeat a message a certain amount of time",
  usage: "{prefix}repeat <ctr:number> <...message:string>",
  async exec(client, message, args) {
    if (isNaN(args[0]))
      throw new Error(`\`${args[0]}\` is not a valid amount!`);
    return message.channel.send(
      (args.slice(1, args.length).join(" ") + "\n").repeat(parseInt(args[0]))
    );
  }
};
