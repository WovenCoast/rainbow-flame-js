const path = require("path");

module.exports = {
  async exec(client) {
    const statuses = ["online", "idle", "dnd"];
    let currentStatus = 0;
    function setStatus() {
      const presence = client.util.getRandom(client.presences)(client);
      client.user.setPresence({
        activity: {
          name: `${presence} | ${client.util.getRandom(client.prefix)}help | ${
            client.version
          }`,
          type: "WATCHING",
        },
        status: statuses[currentStatus],
      });
      currentStatus =
        currentStatus + 1 > statuses.length ? 0 : currentStatus + 1;
    }
    console.log(`Ready as ${client.user.tag}!`);
    setStatus();
    setInterval(setStatus, 15000);
    client.commandStatus.exec = await client.db.client.get(
      client.user.id,
      "commandsExec",
      client.commandStatus.exec
    );
    client.commandStatus.success = await client.db.client.get(
      client.user.id,
      "commandsSuccess",
      client.commandStatus.success
    );
    client.commandStatus.fail = await client.db.client.get(
      client.user.id,
      "commandsFail",
      client.commandStatus.fail
    );
    client.cooldowns = Map.from(
      JSON.parse(
        await client.db.client.get(
          client.user.id,
          "cooldowns",
          JSON.stringify(Array.from(client.cooldowns))
        )
      )
    );
    if (
      (await client.db.client.get(client.user.id, "restartTimestamp")) !== 0
    ) {
      const feedbackChannel = await client.db.client.get(
        client.user.id,
        "restartInvokedChannel"
      );
      if (!feedbackChannel) return;
      const start = await client.db.client.get(
        client.user.id,
        "restartTimestamp"
      );
      const millis = Date.now() - start;
      feedbackChannel.send(
        `:white_check_mark: Successfully restarted the bot in ${client.util.convertMs(
          millis
        )} (${millis}ms)!`
      );
      await client.db.client.set(client.user.id, "restartTimestamp", 0);
      await client.db.client.set(client.user.id, "restartInvokedChannel", "");
      await client.db.client.set(client.user.id, "cooldowns", "");
    }
  },
};
