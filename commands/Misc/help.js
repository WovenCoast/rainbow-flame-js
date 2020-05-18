const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "help"],
  usage: "{prefix}help [command:string|category:string]",
  async exec(client, message, args) {
    if (!args[0]) {
      const embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setFooter(client.commands.size)
        .setAuthor(
          `${message.author.tag} | Help`,
          message.author.displayAvatarURL()
        );
      Object.keys(client.categories).forEach((category) => {
        const commands = client.commands.filter(
          (command) => command.category === category
        );
        embed.addField(
          `**${category}**: ${client.util.pluralify(commands.size, "Command")}`,
          commands.map((command) => `\`${command.name}\``).join(", ")
        );
      });
      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(client.colors.info)
        .setAuthor(
          `${message.author.tag} | Help`,
          message.author.displayAvatarURL()
        );
      if (
        Object.keys(client.categories).some(
          (category) => category.toLowerCase() === args[0].toLowerCase()
        )
      ) {
        const category = Object.keys(client.categories).find(
          (category) => category.toLowerCase() === args[0].toLowerCase()
        );
        embed.setTitle(
          `**${category}**: ${client.util.pluralify(
            client.categories[category].length,
            "Command"
          )}`
        );
        embed.setDescription(
          client.categories[category]
            .map((commandName) => `\`${commandName}\``)
            .join(", ")
        );
      } else if (
        client.commands.has(args[0].toLowerCase()) ||
        client.aliases.has(args[0].toLowerCase())
      ) {
        const command = client.commands.has(args[0].toLowerCase())
          ? client.commands.get(args[0].toLowerCase())
          : client.commands.get(client.aliases.get(args[0].toLowerCase()));
        embed.setTitle(command.name);
        if (command.description) {
          embed.addField("**Description**:", command.description);
        }
        embed.addField(
          "**Aliases**:",
          command.aliases.map((alias) => `\`${alias}\``).join(", ") || "None"
        );
        embed.addField(
          "**Usage**:",
          (command.usage || `{prefix}${command.name}`).replace(
            "{prefix}",
            client.util.getRandom(client.prefix)
          )
        );
      } else {
        embed
          .setColor(client.colors.error)
          .setDescription(
            `Invalid command! Try doing \`${client.util.getRandom(
              client.prefix
            )}help\` with no arguments to see what the commands are!`
          );
      }
      return message.channel.send(embed);
    }
  },
};
