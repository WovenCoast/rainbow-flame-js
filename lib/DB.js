const Endb = require('endb');
const removePunctuation = /[^A-Za-z0-9]/gi;
class DB {
	constructor(client, schema, options) {
		this.types = {
			string: (client, arg) => arg.toString(),
			int: (client, arg) => !isNaN(arg) ? parseInt(arg) : null,
			float: (client, arg) => !isNaN(arg) ? parseFloat(arg) : null,
			channel: (client, arg) => client.channels.cache.has(arg.replace(removePunctuation, "")) ? client.channels.cache.get(arg.replace(removePunctuation, "")) : null,
			role: (client, arg) => client.guilds.cache.some(guild => Array.from(guild.roles.cache).some(role => role.id === arg.replace(removePunctuation, ""))).roles.cache.get(arg.replace(removePunctuation, "")) ? client.guilds.cache.find(guild => Array.from(guild.roles.cache).some(role => role.id === arg.replace(removePunctuation, ""))).roles.cache.get(arg.replace(removePunctuation, "")) : null
		};
		this.schema = schema;
		this.client = client;
		this.db = new Endb(options);
		this.db.on('error', error => console.error('Connection Error: ', error));
	}
	async get(uid, key) {
		if (this.schema[key].array) return (await this.db.ensure(uid + ":" + key, this.schema[key].default || [])).map(v => this.types[this.schema[key].type](this.client, v));
		return this.types[this.schema[key].type](this.client, await this.db.ensure(uid + ":" + key, this.schema[key].default));
	}
	async set(uid, key, value) {
		if (this.schema[key].modifiable) return await this._set(uid, key, value)
		else return false;
	}
	async _set(uid, key, value) {
		if (this.schema[key].array) {
			if (!(value instanceof Array)) return new Error(`Expected Array<${this.schema[key].type}> but got ${typeof value}.`);
			if (value.some(v => this.types[this.schema[key].type](this.client, v) === null)) return new Error(`Not all values of Array<${this.schema[key].type}> are convertable`);
			const res = await this.db.set(uid + ":" + key, value);
			return res;
		}
		if (this.types[this.schema[key].type](this.client, value) === null) return new Error(`Cannot set ${key} of type ${this.schema[key].type} to ${value}`);
		const res = await this.db.set(uid + ":" + key, value);
		return res;
	}
}

module.exports = DB;