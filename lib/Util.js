class Util {
	constructor(client) {
	  this.client = client;
	}
	parseUser(value) {
	  return this.client.users.cache.find(u => u.id === value.replace(/[^0-9]/gi, "")) || this.client.users.cache.find(u => u.username === value.replace(/[^A-Za-z0-9]/gi, "")) || this.client.users.cache.find(u => u.tag.replace(/[^A-Za-z0-9]/gi, "") === value.replace(/[^A-Za-z0-9]/gi, ""));
	}
	formatMoney(value) {
	  return "UC " + value;
	}
	randomValue(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}
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
	convertBytes(bytes) {
	  const decimals = 2;
	  if (bytes == 0) return "0 Bytes";
	  var k = 1024,
		dm = decimals <= 0 ? 0 : decimals || 2,
		sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}
	getRandom(arr) {
	  return arr[Math.floor(Math.random() * arr.length)];
	}
	titleCase(string) {
	  return string[0].toUpperCase() + string.slice(1).toLowerCase();
	}
	pluralify(amount, string) {
	  if (amount === 1) return amount + " " + string;
	  else return amount + " " + string + "s";
	}
  }

  module.exports = Util;