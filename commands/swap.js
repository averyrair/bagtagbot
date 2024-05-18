const { SlashCommandBuilder } = require('discord.js');
const { getTagNum, getPlayer, swapTags } = require('../sqlActions');
const { updateRoles } = require('../roles');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('swap')
        .setDescription('Swap tags with another player')
        .addIntegerOption(option => 
            option.setName('number')
            .setDescription('The number of your new tag')
            .setMinValue(1)
            .setMaxValue(50)
            .setRequired(true)
        ),
	async execute(interaction) {
        const playerInfo = (await getPlayer(interaction.user.id))
        if (!playerInfo) {
            interaction.reply({
                content: `Your discord accound has not been registered to a player yet.`,
                ephemeral: true
            });
            return;
        }
        const tagNum = interaction.options.getInteger('number');
        let tagInfo = await getTagNum(tagNum);
        if (!tagInfo) {
            interaction.reply({
                content: `No player currently holds tag #${tagNum}.`,
                ephemeral: true
            });
            return;
        }
        
        const currTagNum = playerInfo.tagNum;
        if (tagNum == currTagNum) {
            interaction.reply({
                content: `You can't swap tags with yourself.`,
                ephemeral: true
            });
            return;
        }
        swapTags(tagNum, currTagNum);
        interaction.reply(
            `Tags Swapped!\n${playerInfo.playerName} now has tag #${tagNum}.\n` +
            `${tagInfo.playerName} now has tag #${currTagNum}`
        );
        updateRoles();
	},
};