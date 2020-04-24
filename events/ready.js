const path = require('path');

module.exports = {
  async exec(client) {
    if ((await client.db.client.get(client.user.id, "restartTimestamp")) !== 0) {
      const feedbackChannel = await client.db.client.get(client.user.id, "restartInvokedChannel");
      if (!feedbackChannel) return;
      const start = await client.db.client.get(client.user.id, "restartTimestamp");
      const millis = Date.now() - start;
      feedbackChannel.send(`:white_check_mark: Successfully restarted the bot in ${client.util.convertMs(millis)}!`);
      await client.db.client.set(client.user.id, "restartTimestamp", 0);
      await client.db.client.set(client.user.id, "restartInvokedChannel", "");
    }
    const statuses = [
      "online",
      "idle",
      "dnd"
    ]
    let currentStatus = 0;
    function setStatus() {
      const presence = client.util.getRandom(client.presences)(client);
      client.user.setPresence({ activity: { name: `${presence} | ${client.util.getRandom(client.prefix)}help | ${client.version}`, type: "WATCHING" }, status: statuses[currentStatus] });
      currentStatus = (currentStatus + 1) > statuses.length ? 0 : currentStatus + 1;
    }
    console.log(`Ready as ${client.user.tag}!`);
    setStatus();
    setInterval(setStatus, 15000)
  }
}
