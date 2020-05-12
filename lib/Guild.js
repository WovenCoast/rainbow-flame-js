const { Guild } = require("discord.js");
const DBBase = require("./DBBase");
const Client = require("./Client");
const Music = require("./Music");

class EnhancedGuild extends Guild {
  /**
   * The enhanced guild for RainbowFlame
   * @param {Client} client The client associated with this guild
   * @param {*} data
   */
  constructor(client, data) {
    super(client, data);
    /**
     * The database associated with this guild
     * @type {DBBase}
     */
    this.db = new DBBase(client.db.guild, this.id);
    this.music = new Music(client, this);
  }
}

module.exports = EnhancedGuild;
