const Discord = require('discord.js')
const translate = require('yandex-translate')(process.env.YANDEX_TRANSLATE).translate;

const langs = {
  'auto': 'Automatic',
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'ma': 'Punjabi',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'gd': 'Scots Gaelic',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu'
};

module.exports = {
  name: 'translate',
  aliases: [],
  desc: "Translate from any language to english",
  usage: "{prefix}translate",
  async exec(client, message, args) {
    var embeds = [];
    var lang = args.shift();
    if (!lang) return message.channel.send('No language to translate to');
    if (lang == 'help') {
      var embed = new Discord.MessageEmbed()
      var count = 0;
      embed.setTitle('Translate: Languages')
      embed.setColor('GREEN')
      embed.setDescription(`All of the values below are valid`)
      Object.keys(langs).forEach((currentLang) => {
        if (count == 10) {
          count = 0;
          embeds.push(embed)
          embed = new Discord.MessageEmbed()
          embed.setTitle('Translate: Languages')
          embed.setColor(client.colors.info)
          embed.setDescription(`All of the values below are valid`)
        }
        embed.addField(langs[currentLang], currentLang, true)
        count++;
      })
      if (embeds[0] == undefined) {
        message.channel.send(embed);
      } else {
        embeds.push(embed)
        var current = 0;
        const msg = await message.channel.send(embeds[current].setFooter(`Page ${current + 1} of ${embeds.length}`));
        await msg.react('◀');
        await msg.react('▶');
        const filter = (reaction, user) => (reaction.emoji.name === '◀' || reaction.emoji.name === '▶') && user.id === message.author.id
        const collector = msg.createReactionCollector(filter, {
          time: 120000
        });
        collector.on('collect', r => {
          const emoji = r.emoji;
          if (emoji.name === '◀') {
            current--;
            if (current == -1) current = 0;
          } else if (emoji.name === '▶') {
            current++;
            if (current == embeds.length) current = embeds.length - 1;
          }
          const embed = embeds[current];
          embed.setFooter(`Page ${current + 1} of ${embeds.length}`)
          msg.edit(embeds[current])
          r.remove(message.author);
          msg.react(emoji);
        });
      }
      return;
    }
    if (!args) throw new Error('Nothing to translate');
    if (!langs[lang]) lang = getCode(lang);
    translate(args.join(' '), {
      to: lang
    }, (err, res) => {
      if (err) console.log(err)
      if (res.code !== 200) throw new Error(`${lang} is not a valid language! To view the list of valid languages try \`${client.prefix[0]}translate help\``);
      const embed = new Discord.MessageEmbed()
        .setColor(client.colors.success)
        .setAuthor(`${message.author.tag} | ${res.lang} translation`, message.author.displayAvatarURL({ dynamic: true }))
        .addField('Input', args.join(' '))
        .addField('Output', res.text)
      message.channel.send(embed);
    })
  }
}

function getCode(desiredLang) {
  if (!desiredLang) {
    return false;
  }
  desiredLang = desiredLang.toLowerCase();

  if (langs[desiredLang]) {
    return desiredLang;
  }

  var keys = Object.keys(langs).filter(function (key) {
    if (typeof langs[key] !== 'string') {
      return false;
    }

    return langs[key].toLowerCase() === desiredLang;
  });

  return keys[0] || false;
}