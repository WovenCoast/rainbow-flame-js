const Client = require("./Client");

class Util {
	/**
	 * Utilities to make life easier
	 * @param {Client} client The custom client associated with the utilities
	 */
	constructor(client) {
		/**
		 * The custom client associated with the utilities
		 * @type {Client}
		 */
		this.client = client;
	}
	/**
	 * Find the user using their id, username or tag
	 * @param {string} value The user's id, username or tag
	 */
	parseUser(value) {
		return this.client.users.cache.find(u => u.id === value.replace(/[^0-9]/gi, "")) || this.client.users.cache.find(u => u.username === value.replace(/[^A-Za-z0-9]/gi, "")) || this.client.users.cache.find(u => u.tag.replace(/[^A-Za-z0-9]/gi, "") === value.replace(/[^A-Za-z0-9]/gi, ""));
	}
	/**
	 * Format an amount to their money equivalent
	 * @param {number} value The amount to be turned into money
	 */
	formatMoney(value) {
		return "UC " + value;
	}
	/**
	 * Get a random value between two values
	 * @param {number} min The minimum value that it can return
	 * @param {number} max The maximum value that it can return
	 */
	randomValue(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	/**
	 * Convert an accurate number of milliseconds into an approximation of the highest unit of human readable figures in time
	 * @param {number} ms The amount of milliseconds to be converted into a human readable figure
	 */
	convertMs(ms) {
		const showWith0 = value => (value < 10 ? `0${value}` : value);
		const days = showWith0(Math.floor((ms / (1000 * 60 * 60 * 24)) % 60));
		const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 24));
		const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
		const seconds = showWith0(Math.floor((ms / 1000) % 60));
		if (parseInt(days)) return `${days}d`;
		if (parseInt(hours)) return `${hours}h`;
		if (parseInt(minutes)) return `${minutes}min`;
		if (parseInt(seconds)) return `${seconds}s`;
		if (parseInt(ms)) return `${ms}ms`;
	}
	/**
	 * Convert an accurate representation of bytes into an approximation of the highest unit of human readable figures in computational space
	 * @param {number} bytes The amount of bytes to be converted into a human readable figure
	 */
	convertBytes(bytes) {
		const decimals = 2;
		if (bytes == 0) return "0 Bytes";
		var k = 1024,
			dm = decimals <= 0 ? 0 : decimals || 2,
			sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}
	/**
	 * Get a random element from an array
	 * @param {Array<any>} arr The array to get a random element from
	 */
	getRandom(arr) {
		return arr[this.randomValue(0, arr.length)];
	}
	/**
	 * Turn a string of any case into title case
	 * @param {*} string The string to be turned into title case
	 */
	titleCase(string) {
		return string.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ");
	}
	/**
	 * Turn a string into its plural form based on a certain amount
	 * @param {number} amount The amount to check for
	 * @param {string} string The appending string after the amount
	 * @param {boolean} [returnAmount=true] Whether it should return the amount with the pluralified string
	 */
	pluralify(amount, string, returnAmount = true) {
		if (amount === 1) return (returnAmount ? amount + " " : "") + string;
		else return (returnAmount ? amount + " " : "") + string + "s";
	}
}

module.exports = Util;