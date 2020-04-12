require('dotenv').config();

const token = process.env.DISCORD_BOT_RIPOSTE_TOKEN;

const Discord = require('discord.js');

const Save = require('./actions/save');
const Find = require('./actions/find');
const List = require('./actions/list');
const Remove = require('./actions/remove');
const Logger = require('./logger');

const bot = new Discord.Client();

bot.on('ready', () => {
  Logger.info('UP');
});

bot.on('message', async (msg) => {
  if (msg.member.id === bot.user.id) {
    return;
  }
  const guildId = msg.member.guild.id;
  const { content } = msg;
  const paramsArr = content.split(' ');
  const command = paramsArr[0];

  if (command === '--save') {
    const params = content.slice(command.length + 1, content.length);
    const pattern = '--key (.*) --value (.*)';
    const matches = params.match(pattern);
    if (!matches) {
      msg.reply('Invalid command, it should be: --save --key {key} --value {value}');
      return;
    }
    const mapping = {
      key: matches[1],
      value: matches[2],
    };
    const { error } = await Save.execute(guildId, mapping);
    if (error) {
      msg.reply('Something went wrong :[');
      return;
    }
    msg.reply('Added :]');
  } else if (command === '--remove') {
    const key = paramsArr[1];
    if (!key) {
      msg.reply('Invalid command, it should be: --remove {key}');
      return;
    }
    const { removed, error } = await Remove.execute(guildId, key);
    if (error) {
      msg.reply('Something went wrong :[');
    } else if (removed) {
      msg.reply('Removed :]');
    } else {
      msg.reply('Unable to remove :o');
    }
  } else if (command === '--list') {
    const { mappings, error } = await List.execute(guildId);
    if (error) {
      msg.reply('Something went wrong :[');
    }
    msg.reply(JSON.stringify(mappings));
  } else {
    const { reply, error } = await Find.execute(guildId, msg.content);
    if (error) {
      msg.reply('Something went wrong :[');
    } else if (reply) {
      msg.reply(reply);
    }
  }
});
bot.login(token);