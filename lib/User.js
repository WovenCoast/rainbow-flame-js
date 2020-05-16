const { Structures, User } = require("discord.js");
const DBBase = require("./DBBase");

class EnhancedUser extends User {
  /**
   * The enhanced user for RainbowFlame
   * @param {Client} client The client associated with this guild
   * @param {*} data
   */
  constructor(client, data) {
    super(client, data);
    /**
     * The database associated with this member
     * @type {DBBase}
     */
    this.db = new DBBase(
      this.id === "697333942306603078" ? client.db.client : client.db.user,
      this.id
    );
  }
}

module.exports = Structures.extend("User", (User) => EnhancedUser);
