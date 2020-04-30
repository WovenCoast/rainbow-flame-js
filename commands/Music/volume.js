module.exports = {
  name: "volume",
  aliases: ["v"],
  desc: "Adjust the volume of music playback",
  async exec(client, message, args) {
    if (!message.guild.music.playing) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    if (!args[0]) return message.channel.send(`:loud_sound: The current volume is **${message.guild.music.volume * 100}%**`);
    if (isNaN(args[0])) throw new Error("You need to input a number as the second argument!");
    if (parseInt(args[0]) <= 0) throw new Error("Cannot set volume below 1%");
    const volume = parseInt(args) / 100;
    message.guild.music.volume = volume;
    message.guild.music.connection.dispatcher.setVolume(volume);
    return message.channel.send(`:white_check_mark: Set volume to **${message.guild.music.volume * 100}%**`);
  }
}