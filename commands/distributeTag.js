const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sqlActions = require('../sqlActions');
const { updateRoles } = require('../roles');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('distributetag')
        .setDescription('Give out the next unused tag number to a player')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName('name')
            .setDescription('The player\'s name. ' + 
                'This should match the full name associated with their UDisc account'
            )
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('number')
            .setDescription('The tag number to give out')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(50)
        ),
	async execute(interaction) {
        
        const playerName = interaction.options.getString('name');
        const tagNum = interaction.options.getInteger('number')
        let result = await sqlActions.getPlayer(null, playerName);

        if (result) {
            interaction.reply({
                content: `${result.playerName} already has tag #${result.tagNum}`, 
                ephemeral:true
            });
            return;
        }
        result = await sqlActions.getTagNum(tagNum);
        if (result && result.playerName != 'not in circulation') {
            interaction.reply({
                content: `${result.playerName} already has tag #${result.tagNum}`,
                ephemeral: true
            });
            return;
        }

        sqlActions.distributeTag(playerName, tagNum);
        result = await sqlActions.getPlayer(null, playerName);
        if (result) {
            interaction.reply(`Tag #${result.tagNum} given to ${result.playerName}`)
            updateRoles();
        }
        else {
            interaction.reply({content: 'something went wrong...', ephemeral: true})
        }
	},
};