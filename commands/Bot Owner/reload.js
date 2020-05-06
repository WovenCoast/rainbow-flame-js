const Discord = require("discord.js");
const path = require("path");
const childProcess = require("child_process");

module.exports = {
  name: "reload",
  aliases: [],
  desc: "Reload everything in the bot",
  async exec(client, message, args) {
    if (!client.owners.includes(message.author.id))
      throw new Error(
        "You don't have enough permissions to reload my commands"
      );
    const start = Date.now();
    await childProcess.exec(
      "git pull && npm i",
      async (err, stdout, stderr) => {
        if (err)
          await message.channel.send(
            `Something went wrong:-\`\`\`${stderr}\`\`\`Restarting anyways...`
          );

        client.commands.forEach((command) => {
          delete require.cache[
            require.resolve(
              path.join(
                require.main.path,
                client.customOptions.commands,
                command.category,
                command.name + ".js"
              )
            )
          ];
        });
        client.removeAllListeners();
        client.commands = new Discord.Collection();
        client.aliases = new Discord.Collection();
        client._readCommands(client.customOptions.commands);
        client._readEvents(client.customOptions.events);
        const millis = Date.now() - start;
        message.channel.send(
          `:white_check_mark: Successfully reloaded all the commands in ${client.util.convertMs(
            millis
          )} (${millis}ms)!`
        );
      }
    );
  },
};
