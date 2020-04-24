const { Structures } = require('discord.js');

Structures.extend("Guild", (Guild) => {
	return require('./Guild');
})
Structures.extend("Member", (Member) => {
	return require('./Member');
});
Structures.extend("User", (User) => {
	return require('./User');
});

module.exports = {
	Client: require('./Client'),
	DBClient: require('./DBClient'),
	DBBase: require('./DBBase'),
	Util: require('./Util'),
	Guild: require('./Guild'),
	Member: require('./Member'),
	User: require('./User'),
	Music: require('./Music')
}