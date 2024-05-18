const { SlashCommandBuilder } = require('discord.js');
const { getTagNum, getPlayer, swapTags } = require('../sqlActions');

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
        const tagNum = interaction.options.getInteger('number');
        let tagInfo = await getTagNum(tagNum);
        if (!tagInfo) {
            interaction.reply({
                content: `No player currently holds tag #${tagNum}.`,
                ephemeral: true
            });
            return;
        }
        
        const playerInfo = (await getPlayer(interaction.user.id))
        const currTagNum = playerInfo.tagNum;
        swapTags(tagNum, currTagNum);
        interaction.reply(
            `Tags Swapped!\n${playerInfo.playerName} now has tag #${tagNum}.\n` +
            `${tagInfo.playerName} now has tag #${currTagNum}`
        );
	},
};