module.exports = {
  name: "transfer",
  aliases: [],
  desc: "Transfer UC to another member",
  usage: "{prefix}transfer <user:string|user:mention> <amount:int|'all'>",
  async exec(client, message, args) {
    let user = client.util.parseUser(args[0]);
    if (!user) throw new Error("You need to pass in to who you want to transfer!");
    if (user.bot) throw new Error("You can't transfer money to a bot!");
    if (!args[1]) throw new Error("You need to pass in how much you want to transfer!");
    const wallet = await client.db.member.get(message.guild.id + message.author.id, "wallet");
    let amount = args[1];
    if (args[1] === "all") {
      amount = wallet;
    }
    if (isNaN(amount)) throw new Error(`${amount} is not a valid number!`);
    if (parseInt(amount) < 1) throw new Error(`${amount} is too small of a value!`);
    if (parseInt(amount) > wallet) throw new Error(`Cannot transfer more than what you already have!`);
    amount = parseInt(amount);
    await client.db.member.set(message.guild.id + message.author.id, "wallet", (await client.db.member.get(message.guild.id + message.author.id, "wallet")) - amount);
    await client.db.member.set(message.guild.id + user.id, "wallet", (await client.db.member.get(message.guild.id + user.id, "wallet")) + amount);
    return message.channel.send(`:white_check_mark: Successfully transferred ${client.util.formatMoney(amount)} to ${user.tag}!`);
  }
}