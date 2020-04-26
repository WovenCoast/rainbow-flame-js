module.exports = {
  name: "deposit",
  aliases: ["dep"],
  desc: "Move UC from your wallet into your bank",
  usage: "{prefix}deposit <amount:int|'all'>",
  async exec(client, message, args) {
    if (!args[0]) throw new Error("You need to pass in how much you want to move from your wallet to your bank!");
    const wallet = await client.db.member.get(message.guild.id + message.author.id, "wallet");
    const bank = await client.db.user.get(message.author.id, "bank");
    let amount = args[0];
    if (args[0] === "all") {
      amount = wallet;
    }
    if (isNaN(amount)) throw new Error(`${amount} is not a valid number!`);
    if (parseInt(amount) < 1) throw new Error(`${amount} is too small of a value!`);
    if (parseInt(amount) > wallet) throw new Error(`Cannot deposit more than what you already have!`);
    amount = parseInt(amount);
    await client.db.member._set(message.guild.id + message.author.id, "wallet", wallet - amount);
    await client.db.user._set(message.author.id, "bank", bank + amount);
    return message.channel.send(`:white_check_mark: Successfully transferred ${client.util.formatMoney(amount)} to your bank!`);
  }
}