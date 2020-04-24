const path = require('path');

module.exports = {
  async exec(client) {
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
