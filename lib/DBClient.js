const { Endb, EndbOptions } = require("endb");
const Client = require("./Client");
const removePunctuation = /[^A-Za-z0-9]/gi;

class DBClient {
  /**
   * The custom database client for the custom client
   * @param {Client} client The custom client associated with the database
   * @param {any} schema The schema that the values set to the bot should follow
   * @param {EndbOptions} options The options to be passed into the Endb constructor
   */
  constructor(client, schema, options) {
    /**
     * The deserialization types associated with the database client
     * @type {Object<string, Function(Client, any)<string|null>>}
     */
    this.types = {
      string: (client, arg) => arg.toString(),
      int: (client, arg) => (!isNaN(arg) ? parseInt(arg) : null),
      bool: (client, arg) => !!arg,
      float: (client, arg) => (!isNaN(arg) ? parseFloat(arg) : null),
      channel: (client, arg) =>
        client.channels.cache.has(arg.replace(removePunctuation, ""))
          ? client.channels.cache.get(arg.replace(removePunctuation, ""))
          : null,
      role: (client, arg) =>
        client.guilds.cache
          .find((guild) =>
            Array.from(guild.roles.cache).some(
              (role) => role.id === arg.replace(removePunctuation, "")
            )
          )
          .roles.cache.get(arg.replace(removePunctuation, ""))
          ? client.guilds.cache
              .find((guild) =>
                Array.from(guild.roles.cache).some(
                  (role) => role.id === arg.replace(removePunctuation, "")
                )
              )
              .roles.cache.get(arg.replace(removePunctuation, ""))
          : null,
    };
    /**
     * The schema that the values set to the bot should follow
     * @type {*}
     */
    this.schema = schema;
    /**
     * The custom client associated with the database
     * @type {Client}
     */
    this.client = client;
    /**
     * The Endb instance associated with the database
     * @type {Endb}
     */
    this.db = new Endb(options);
    this.db.on("error", (error) => console.error("Connection Error: ", error));
  }
  async ensure(key, value) {
    return this.db.has(key) ? this.db.get(key) : value;
  }
  /**
   * Get a value from the database
   * @param {string} uid The identifier for the key
   * @param {string} key The key identifier for the value in the database
   */
  async get(uid, key) {
    if (this.schema[key].array)
      return (
        await this.ensure(uid + ":" + key, this.schema[key].default || [])
      ).map((v) => this.types[this.schema[key].type](this.client, v));
    return this.types[this.schema[key].type](
      this.client,
      await this.ensure(uid + ":" + key, this.schema[key].default)
    );
  }
  /**
   * Set a value to the database
   * @param {string} uid The identifier for the key
   * @param {string} key The key identifier for the value in the database
   * @param {*} value The value to be set to the database
   */
  async set(uid, key, value) {
    if (this.schema[key].modifiable) return await this._set(uid, key, value);
    else return false;
  }
  /**
   * Set a value to the database ignoring the modifiable attribute from the schema
   * @param {string} uid The identifier for the key
   * @param {string} key The key identifier for the value in the database
   * @param {*} value The value to be set to the database
   */
  async _set(uid, key, value) {
    if (this.schema[key].array) {
      if (!(value instanceof Array))
        return new Error(
          `Expected Array<${this.schema[key].type}> but got ${typeof value}.`
        );
      if (
        value.some(
          (v) => this.types[this.schema[key].type](this.client, v) === null
        )
      )
        return new Error(
          `Not all values of Array<${this.schema[key].type}> are convertable`
        );
      const res = await this.db.set(uid + ":" + key, value);
      return res;
    }
    if (this.types[this.schema[key].type](this.client, value) === null)
      return new Error(
        `Cannot set ${key} of type ${this.schema[key].type} to ${value}`
      );
    const res = await this.db.set(uid + ":" + key, value);
    return res;
  }
}

module.exports = DBClient;
