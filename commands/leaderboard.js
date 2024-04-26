const { SlashCommandBuilder } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('tags')
        .setDescription('Shows the tags leaderboard'),
	async execute(interaction) {
        const leaderboard = await sqlActions.getLeaderboard();
        let message = 'Tags Leaderboard\n';
        for (pos of leaderboard) {
            message += `${pos.tagNum}. ${pos.playerName}\n`;
        }
        interaction.reply(message);
	},
};