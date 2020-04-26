const Discord = require('discord.js');

module.exports = {
  name: "guildMemberAdd",
  async exec(client, member) {
    const leaveMessages = (await client.db.guild.get(member.guild.id, "leaveMessages"));
    const memberLogChannel = await client.db.guild.get(member.guild.id, "memberLogs");
    if (!memberLogChannel) return;
    memberLogChannel.send(new Discord.MessageEmbed().setTimestamp().setColor(client.colors.error).setAuthor(`${member.guild.name} | Lost Member`, member.guild.iconURL({ dynamic: true })).setDescription(client.util.getRandom(leaveMessages).replace(/{(.*)}/gi, (match, property) => `**${client.templates[property](member)}**`)).setThumbnail(member.user.displayAvatarURL({ dynamic: true })).setFooter(`In other words, good bye ${member.user.tag}. Now there's only ${member.guild.memberCount} to enjoy ${member.guild.name}`));
  }
}