const DBClient = require('./DBClient');
const { Endb } = require('endb');

class DBBase {
	/**
	 * The base for all databases
	 * @param {DBClient} client The custom database client associated with the database
	 * @param {string} id The id associated with the database
	 */
	constructor(client, id) {
		/**
		 * The custom database client associated with the database
		 * @type {DBClient}
		 */
		this.client = client;
		/**
		 * The id associated with this database
		 * @type {string} 
		 */
		this.id = id;
		/**
		 * The Endb database for ease of access
		 * @type {Endb}
		 */
		this.db = client.db;
	}

	/**
	 * Get a value from the database
	 * @param {string} key The string namespace associated with the value to get from the database
	 */
	async get(key) {
		return await this.client.get(this.id, key);
	}

	/**
	 * Set a value to the database
	 * @param {string} key The string namespace associated with the value to set to the database
	 * @param {*} value Any serializable value
	 * @param {boolean} [ignoreModifiable=false] Whether the modifiable value for the key in the schema is overridden or not
	 */
	async set(key, value, ignoreModifiable = false) {
		return ignoreModifiable ? await this.client._set(this.id, key, value) : await this.client.set(this.id, key, value);
	}
}

module.exports = DBBase;