const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sqlActions = require('../sqlActions');

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
        ),
	async execute(interaction) {
        
        const playerName = interaction.options.getString('name');
        let result = await sqlActions.getPlayer(null, playerName);

        if (result) {
            interaction.reply({
                content: `${result.playerName} already has tag #${result.tagNum}`, 
                ephemeral:true
            });
            return;
        }

        sqlActions.distributeTag(playerName);
        result = await sqlActions.getPlayer(null, playerName);
        if (result) {
            interaction.reply(`Tag #${result.tagNum} given to ${result.playerName}`)
        }
        else {
            interaction.reply({content: 'something went wrong...', ephemeral: true})
        }
	},
};