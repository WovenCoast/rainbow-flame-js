const validStates = ["noloop", "all", "shuffle", "shuffleall", "one"];

module.exports = {
  name: "loop",
  aliases: [],
  desc: "Set the loop state for music playback",
  async exec(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    if (!args[0]) return message.channel.send(`:repeat: Loop is currently set to \`${serverQueue.loop}\``);
    if (!validStates.includes(args[0].toLowerCase())) throw new Error(`You cannot set loop to \`${args[0].toLowerCase()}\`. Valid states are \`${validStates.join("`, `")}\``);
    serverQueue.loop = args[0].toLowerCase();
    return message.channel.send(`:white_check_mark: Successfully set loop to \`${args[0].toLowerCase()}\`!`);
  }
}