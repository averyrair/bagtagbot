const { SlashCommandBuilder } = require('discord.js');
const { getTagNum, revokeTag } = require('../sqlActions');
const { updateRoles } = require('../roles');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('revoketag')
        .setDescription('Takes a tag out of circulation')
        .addIntegerOption(option =>
            option.setName('number')
            .setDescription('The tag number to reclaim.')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(50)
        ),
	async execute(interaction) {
        const tagNum = interaction.options.getInteger('number');
        const tagInfo = await getTagNum(tagNum);
        if (!tagInfo) {
            interaction.reply({
                content: `Tag #${tagNum} not found. Are you sure it was registered in the system?`,
                ephemeral: true
            });
            return;
        }
        revokeTag(tagNum);
        interaction.reply(`Tag #${tagNum} removed.\n${tagInfo.playerName} no longer has a tag.`);
        updateRoles();
	},
};