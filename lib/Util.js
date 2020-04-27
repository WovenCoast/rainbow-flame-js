const Client = require("./Client");
const { User } = require("discord.js");

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
   * @returns {User} The user
   */
  parseUser(value) {
    return (
      this.client.users.cache.find(
        u => u.id === value.replace(/[^0-9]/gi, "")
      ) ||
      this.client.users.cache.find(
        u => u.username === value.replace(/[^A-Za-z0-9]/gi, "")
      ) ||
      this.client.users.cache.find(
        u =>
          u.tag.replace(/[^A-Za-z0-9]/gi, "") ===
          value.replace(/[^A-Za-z0-9]/gi, "")
      )
    );
  }
  /**
   * Format an amount to their money equivalent
   * @param {number} value The amount to be turned into money
   * @returns {string} The money
   */
  formatMoney(value) {
    return "UC " + value;
  }
  /**
   * Get a random value between two values
   * @param {number} min The minimum value that it can return
   * @param {number} max The maximum value that it can return
   * @returns {number} The random number it chose
   */
  randomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  /**
   * Convert an accurate number of milliseconds into an approximation of the highest unit of human readable figures in time
   * @param {number} ms The amount of milliseconds to be converted into a human readable figure
   * @returns {string} The time figure in a human readable format
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
   * @returns {string} The byte figure in a human readable format
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
   * Convert an amount of seconds into an approximation of the highest possible values
   * @param {number} duration The duration to be converted into a human readable figure (in seconds)
   * @returns {string} The duration string
   */
  convertDuration(duration) {
    const showWith0 = value => (value < 10 ? `0${value}` : value);
    const seconds = showWith0(Math.floor(duration % 60));
    const minutes = showWith0(Math.floor(duration / 60) % 60);
    const hours = showWith0(Math.floor((duration / 60 / 60) % 24));
    const days = showWith0(Math.floor(duration / 60 / 60 / 24));
    return `${days !== "00" ? days + ":" : ""}${
      hours !== "00" ? hours + ":" : ""
    }${minutes}:${seconds}`;
  }
  /**
   * Get a random element from an array
   * @param {Array<any>} arr The array to get a random element from
   * @returns {any} The random element
   */
  getRandom(arr) {
    return arr[this.randomValue(0, arr.length)];
  }
  /**
   * Turn a string of any case into title case
   * @param {string} string The string to be turned into title case
   * @returns {string} The string in title case
   */
  titleCase(string) {
    return string
      .split(" ")
      .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");
  }
  /**
   * Turn a string into its plural form based on a certain amount
   * @param {number} amount The amount to check for
   * @param {string} string The appending string after the amount
   * @param {boolean} [returnAmount=true] Whether it should return the amount with the pluralified string
   * @returns {string} The pluralified string with(out) the amount
   */
  pluralify(amount, string, returnAmount = true) {
    if (amount === 1) return (returnAmount ? amount + " " : "") + string;
    else return (returnAmount ? amount + " " : "") + string + "s";
  }
  /**
   * Shuffle an array
   * @param {Array<any>} array The array to be shuffled
   * @returns {Array<any>} The shuffled array
   */
  shuffle(array) {
    const tempArray = Object.assign([], array);
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = tempArray[currentIndex];
      tempArray[currentIndex] = tempArray[randomIndex];
      tempArray[randomIndex] = temporaryValue;
    }

    return tempArray;
  }

  /**
   * Split a string into chunks of a certain length
   * @param {number} length The maximum chunk length
   * @param {string} string The string to split into chunks
   */
  chunk(length, string) {
    return string.match(new RegExp(`.{1, ${length}}`, "g"));
  }

  /**
   * Parse the song to be in a human readable format
   * @param {import("./Music").Song} title The song
   */
  parseSongName(song) {
    return (
      (song.title.includes(song.author)
        ? song.title.replace(song.author, `**${song.author}**`)
        : `**${song.title}** by *${song.author}*`) +
      ` requested by **${song.requestedBy}** : ${this.convertDuration(
        song.duration
      )}`
    );
  }
}

module.exports = Util;
