const Discord = require("discord.js");

const cancelKeywords = ["cancel", "abort"];
const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten"
];
const adjNumbers = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth"
];
module.exports = {
  name: "poll",
  aliases: [],
  desc: "Create a poll in your server",
  async exec(client, message, args) {
    let question = args.join(" ");
    // Import question if not given
    if (!args[0]) {
      const questionMsg = await message.channel.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setColor(client.colors.info)
          .setAuthor(
            `${message.author.tag} | Poll`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setFooter(
            `Reply with ${cancelKeywords.join(", ")} to cancel the poll`
          )
          .setTitle(`What should the question for the poll be?`)
      );

      const questionRes = await awaitMessage(
        message,
        m => m.content.trim() !== ""
      );
      if (cancelKeywords.includes(questionRes.content.toLowerCase())) {

        questionMsg.delete();
        return message.channel.send(`Aborted`);
      }
      question = questionRes.content.trim();

      questionMsg.delete();
      questionRes.delete();
    }
    // Input the amount of options there should be
    const amountMsg = await message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | Poll`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setFooter(`Reply with ${cancelKeywords.join(", ")} to cancel the poll`)
        .setTitle(
          `Alright, the question should be \`${question}\`, how many options for this poll should there be?`
        )
    );

    const amountRes = await awaitMessage(
      message,
      m =>
        !isNaN(m.content) &&
        parseInt(m.content) < reactions.length &&
        parseInt(m.content) > 0
    );
    if (cancelKeywords.includes(amountRes.content.toLowerCase())) {

      amountMsg.delete();
      return message.channel.send(`Aborted`);
    }
    const amount = parseInt(amountRes.content.trim());

    amountMsg.delete();
    amountRes.delete();

    // For every amount, input an option
    let options = [];
    for (let i = 0; i < amount; i++) {
      const optionMsg = await message.channel.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setColor(client.colors.info)
          .setAuthor(
            `${message.author.tag} | Poll`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setFooter(
            `Reply with ${cancelKeywords.join(", ")} to cancel the poll`
          )
          .setTitle(
            i === 0
              ? `Alright, the amount of options should be \`${amount}\`, what should the first option be?`
              : `Alright, the ${adjNumbers[i]} option should be \`${
              options[i - 1]
              }\`, what should the ${adjNumbers[i + 1]} option be?`
          )
      );

      const optionRes = await awaitMessage(
        message,
        m => m.content.trim() !== ""
      );
      if (cancelKeywords.includes(optionRes.content.toLowerCase())) {

        optionMsg.delete();
        return message.channel.send(`Aborted`);
      }
      options.push(optionRes.content);

      optionMsg.delete();
      optionRes.delete();
    }

    // Display the final poll
    const pollMsg = await message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | Poll`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setFooter("Loading...")
        .setDescription(`Preparing a poll...`)
    );
    for (let i = 0; i < amount; i++) {
      await pollMsg.react(reactions[i]);
    }
    await pollMsg.edit(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | ${question}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setFooter(`React with the emojis below to vote for the options above`)
        .setDescription(
          `${options
            .map((option, index) => `${reactions[index]} ${option}`)
            .join("\n")}`
        )
    );
  }
};
function awaitMessage(message, filter) {
  return new Promise((resolve, reject) => {
    const collector = message.channel.createMessageCollector(filter);
    let collected = false;
    collector.once("collect", m => {
      collected = true;
      resolve(m);
    });
    collector.once("end", messages => {
      if (!collected) {
        reject(new Error("Timed out"));
      }
    });
  });
}

// Ah, it's nice to see you again. Don't forget the rubber duck method. it really is,
