import { Message } from 'discord.js';

import { Command } from '../classes';

import { Context } from '../../types';
import { Reply } from '../../entities';

export default class extends Command {
	name: string = '';
	aliases: string[] = [''];
	usage: string = '';
	options: string[] = [];
	async execute(context: Context, body: string, message: Message): Promise<any> {
		const { guild } = context;
		const replies = await Reply.find({ guildId: guild.id });
		const reply = replies.find((r) => {
			const { key, matcher, formatter } = r;
			if (matcher === 'INCLUDES') {
				if (formatter === 'IGNORE_CASE' && body.toUpperCase().includes(key.toUpperCase())) {
					return r;
				}
				if (formatter === 'CASE_SENSITIVE' && body.includes(key)) {
					return r;
				}
			}
			if (matcher === 'PRECISE') {
				if (formatter === 'IGNORE_CASE' && key.toUpperCase() === body.toUpperCase()) {
					return r;
				}
				if (formatter === 'CASE_SENSITIVE' && key === body) {
					return r;
				}
			}
			return null;
		});
		if (reply) {
			this.log.info({ ...context }, 'Replying to User');
			return message.reply(reply.value);
		}
	}
}
