module.exports = {
  name: "skip",
  aliases: ["next"],
  desc: "Skip a playback song",
  async exec (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) throw new Error("This command only works when I'm in a voice channel, try using the `play` command!");
    let count = 1;
    if (args[0] && !isNaN(args[0])) count = parseInt(args[0]);
    if (count > 32768) throw new Error("The maximum amount of songs skippable is 32768 songs!");
    for (let i = 0; i < count - 1; i++) {
      if (serverQueue.loop === "noloop") {
        serverQueue.songs.shift();
      } else if (serverQueue.loop === "all") {
        serverQueue.songs.push(serverQueue.songs.shift());
      } else if (serverQueue.loop === "shuffle") {
        serverQueue.songs.shift();
        serverQueue.songs = shuffle(serverQueue.songs);
      } else if (serverQueue.loop === "shuffleall") {
        serverQueue.songs = shuffle(serverQueue.songs);
      } else if (serverQueue.loop === "one") {
        serverQueue.songs.unshift(serverQueue.songs.shift());
      }
      if (!serverQueue.songs[0]) {
        count = i;
        break;
      };
    }
    serverQueue.dispatcher.end("finish");
    return message.channel.send(`:white_check_mark: Skipped **${client.util.pluralify(count, "song")}**!`)
  }
}

function shuffle(array) {
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