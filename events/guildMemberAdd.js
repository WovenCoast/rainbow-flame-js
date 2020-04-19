const Discord = require('discord.js');

module.exports = {
  name: "guildMemberAdd",
  async exec(client, member) {
    const welcomeMessages = (await client.db.guild.get(member.guild.id, "welcomeMessages"));
    const memberLogChannel = await client.db.guild.get(member.guild.id, "memberLogs");
    if (!memberLogChannel) return;
    memberLogChannel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.success).setAuthor(`${member.guild.name} | New Member`, member.guild.iconURL({ dynamic: true })).setDescription(client.util.getRandom(welcomeMessages).replace(/{(.*)}/gi, (match, property) => `**${client.templates[property](member)}**`)).setThumbnail(member.user.displayAvatarURL({ dynamic: true })).setFooter(`In other words, welcome to ${member.guild.name}! You are the ${member.guild.memberCount}th member!`));
  }
}