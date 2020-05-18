const { Structures, GuildMember } = require("discord.js");
const DBBase = require("./DBBase");
const Client = require("./Client");
const Guild = require("./Guild");

class Member extends GuildMember {
  /**
   * A custom implementation of the member
   * @param {Client} client The client associated with this member
   * @param {any} data The data associated with this member
   * @param {Guild} guild The guild associated with this member
   */
  constructor(client, data, guild) {
    super(client, data, guild);
    /**
     * The database associated with this member
     * @type {DBBase}
     */
    this.db = new DBBase(client.db.member, guild.id + this.id);
  }
}

module.exports = Structures.extend("GuildMember", (GuildMember) => Member);
