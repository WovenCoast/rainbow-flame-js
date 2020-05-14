const Discord = require("discord.js");
const Client = require("../lib/Client");
const EnhancedMessage = require("../lib/Message");

module.exports = {
  name: "message",
  /**
   * @param {Client} client
   * @param {EnhancedMessage} message
   */
  async exec(client, message) {
    if (!(client.randomValue(0, 100) > 30)) return; // Has a 60% rate of returning
    const currentLevel = message.member.db.get("level");
    const xpForNextLevel = currentLevel * 150;
    const oldXp = message.member.db.get("xp");
    const newXp = oldXp + client.util.randomValue(2, 5);
    if (newXp >= xpForNextLevel) {
      // Level up
      message.member.db.set("xp", 0, true);
      message.member.db.set("level", currentLevel + 1, true);
    } else {
      message.member.db.set("xp", newXp, true);
    }
  },
};
