const Discord = require('discord.js');

module.exports = {
  name: "message",
  async exec(client, message) {
    if (message.author.bot) return;
    if (
      message.content.trim() === `<@${client.user.id}>` ||
      message.content.trim() === `<@!${client.user.id}>`
    )
      return message.channel.send(
        `Hey there! Try doing \`${client.util.getRandom(
          client.prefix
        )}help\` to see my commands!`
      );
    const prefixes = [
      `<@${client.user.id}>`,
      `<@!${client.user.id}>`,
      ...client.prefix.map(p => p.trim()),
      ...(await client.db.guild.get(message.guild.id, "prefix"))
    ];
    if (!prefixes.some(p => message.content.toLowerCase().startsWith(p.toLowerCase()))) return;
    const prefix = prefixes
      .find(p => message.content.toLowerCase().startsWith(p.toLowerCase()))
      .toLowerCase();
    const invoke = message.content
      .substr(prefix.length, message.content.length)
      .trim()
      .split(" ")[0]
      .toLowerCase();
    if (!client.commands.has(invoke) && !client.aliases.has(invoke))
      return message.channel.send(
        `**${invoke}** is not a valid command. Try doing \`${client.util.getRandom(
          client.prefix
        )}help\` to see what my commands are!`
      );
    const command = client.commands.has(invoke)
      ? client.commands.get(invoke)
      : client.commands.get(client.aliases.get(invoke));
    const args = message.content
      .slice(invoke.length + prefix.length + 1)
      .trim()
      .split(' ');
    message.prefix = prefix;
    message.invoke = invoke;
    message.args = args;
    client.cooldown.forEach((cooldown, id) => {
      if (((Date.now() - cooldown) / 1000) > 100) client.cooldown.delete(id);
    });
    if (
      client.cooldown.has(
        `${message.author.id}-${message.guild.id}-${command.name.toLowerCase()}`
      )
    ) {
      const timeGone =
        (Date.now() -
          client.cooldown.get(
            `${message.author.id}-${
            message.guild.id
            }-${command.name.toLowerCase()}`
          )) /
        1000;
      if (timeGone + 1 > (command.cooldown || client.defaultCooldown))
        client.cooldown.set(
          `${message.author.id}-${
          message.guild.id
          }-${command.name.toLowerCase()}`,
          Date.now()
        );
      else
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(
              `${message.author.tag} | ${client.util.titleCase(invoke)}`,
              message.author.displayAvatarURL()
            )
            .setColor(client.colors.error)
            .setDescription(
              `Error: You need to wait ${client.util.pluralify(
                Math.floor(
                  (command.cooldown || client.defaultCooldown) - timeGone
                ),
                "more second"
              )} before you can use that command!`
            )
        );
    } else {
      client.cooldown.set(
        `${message.author.id}-${message.guild.id}-${command.name.toLowerCase()}`,
        Date.now()
      );
    }
    client.commandsExec++;
    command
      .exec(client, message, args)
      .then(() => {
        client.commandsSuccess++;
      })
      .catch(err => {
        client.commandsFail++;
        message.channel.send(
          new Discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${message.author.tag} | ${client.util.titleCase(invoke)}`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(client.colors.error)
            .setDescription(`An error occured. Are you sure your usage matches \`${command.usage.replace("{prefix}", client.prefix[0])}\`?\n\n${err}`)
        );
      });
  }
}