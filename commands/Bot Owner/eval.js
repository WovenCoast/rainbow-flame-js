const Discord = require("discord.js");
const util = require("util");
const haste = require("hastebin-gen");

module.exports = {
  name: "eval",
  aliases: [],
  desc: "Evaluate an expression",
  usage: "{prefix}eval <...expression:string>",
  cooldown: 2,
  async exec(client, message, args) {
    if (!client.owners.includes(message.author.id))
      throw new Error(
        "You don't have enough permissions to evaluate a JavaScript command on me"
      );
    if (!args.join(" ")) {
      return message.channel.send("Nothing to be evaled");
    }
    var evaled;
    let color = client.colors.info;
    let millis = 0;
    const start = Date.now();
    try {
      evaled = eval(args.join(" "));
      millis = Date.now() - start;
      if (evaled instanceof Promise) evaled = await evaled;
      if (typeof evaled != "string") {
        evaled = util.inspect(evaled);
      }
      if (evaled.length > 1024) {
        evaled = await haste(evaled.replace(client.token, "no cyka blyat"), {
          url: "http://haste.wovencoast.me",
          extension: "log"
        }).catch(err => {
          throw err;
        });
      }
    } catch (e) {
      evaled = e.stack;
      if (evaled.length > 1024) {
        evaled = evaled.substr(0, 1000) + "...";
      }
      color = client.colors.error;
    }
    message.channel.send(
      new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(color)
        .setFooter(
          `Evaluated in ${client.util.convertMs(millis)} (${millis}ms)`
        )
        .setAuthor(
          `${message.author.tag} | Eval`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .addField("Input", `\`\`\`${args.join(" ")}\`\`\``)
        .addField(
          "Output",
          `${evaled.startsWith("http") ? "" : "```"}${evaled.replace(
            client.token,
            "no cyka blyat"
          )}${evaled.startsWith("http") ? "" : "```"}`
        )
    );
  }
};
