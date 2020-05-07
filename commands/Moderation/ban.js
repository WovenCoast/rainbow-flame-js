module.exports = {
    name: "ban",
    aliases: ["hammer"],
    desc: "Ban",
    async exec(client, message, args) {
        let user = args[0];
        let reason = args[1];
        if (!user) {
            try {
            // Check if a valid userID has been entered instead of a Discord user mention
            if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
            // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
            user = message.guild.members.get(args.slice(0, 1).join(' '));
            user = user.user;
            } catch (error) {
            return message.reply('Couldn\' get a Discord user with this userID!');
            }
            }
            if (user === message.author) return message.channel.send('You can\'t ban yourself'); // Check if the user mention or the entered userID is the message author himsmelf
            if (!reason) return message.reply('You forgot to enter a reason for this ban!'); // Check if a reason has been given by the message author
            if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!'); // Check if the user is bannable with the bot's permissions
            ​
            await message.guild.ban(user) // Bans the user
            ​
            const Discord = require('discord.js'); // We need Discord for our next RichEmbeds
            const banConfirmationEmbed = new Discord.RichEmbed()
            .setColor('RED')
            .setDescription(`✅ ${user.tag} has been successfully banned!`);
            message.channel.send({
            embed: banConfirmationEmbed
            }); // Sends a confirmation embed that the user has been successfully banned
            ​
            ​
            const modlogChannelID = ''; // Discord channel ID where you want to have logged the details about the ban
            if (modlogChannelID.length !== 0) {
            if (!client.channels.get(modlogChannelID )) return undefined; // Check if the modlogChannelID is a real Discord server channel that really exists
            ​
            const banConfirmationEmbedModlog = new Discord.RichEmbed()
            .setAuthor(`Banned by **${msg.author.username}#${msg.author.discriminator}**`, msg.author.displayAvatarURL)
            .setThumbnail(user.displayAvatarURL)
            .setColor('RED')
            .setTimestamp()
            .setDescription(`**Action**: Ban
            **User**: ${user.username}#${user.discriminator} (${user.id})
            **Reason**: ${reason}`);
            client.channels.get(modlogChannelID).send({
            embed: banConfirmationEmbedModlog
            }); // Sends the RichEmbed in the modlogchannel
            }
    }
}