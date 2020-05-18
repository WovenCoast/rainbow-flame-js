const childProcess = require("child_process");

module.exports = {
  name: "restart",
  aliases: [],
  desc: "Restart the bot",
  async exec(client, message, args) {
    if (!client.owners.includes(message.author.id))
      throw new Error("You don't have enough permissions to restart me");
    await client.db.client.set(client.user.id, "restartTimestamp", Date.now());
    await message.channel.send("Pulling from git...");
    await childProcess.exec(
      "git pull && npm i",
      async (err, stdout, stderr) => {
        if (err)
          await message.channel.send(
            `Something went wrong:-\`\`\`${stderr}\`\`\`Restarting anyways...`
          );
        await client.db.client.set(
          client.user.id,
          "cooldowns",
          JSON.stringify(Array.from(client.cooldown.entries()))
        );
        await client.db.client.set(
          client.user.id,
          "commandsExec",
          client.commandStatus.exec
        );
        await client.db.client.set(
          client.user.id,
          "commandsSuccess",
          client.commandStatus.success
        );
        await client.db.client.set(
          client.user.id,
          "commandsFail",
          client.commandStatus.fail
        );
        await client.db.client.set(
          client.user.id,
          "restartInvokedChannel",
          message.channel.id
        );
        await message.channel.send("Restarting...");
        process.exit(0);
      }
    );
  },
};
