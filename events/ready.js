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
      client.user.setPresence({ activity: { name: `${presence} | ${client.util.getRandom(client.prefix)}help`, type: "WATCHING" }, status: statuses[currentStatus] });
      currentStatus = client.util.randomValue(0, statuses.length - 1);
    }
    console.log(`Ready as ${client.user.tag}!`);
    setStatus();
    setInterval(setStatus, 15000)
  }
}
