const { SlashCommandBuilder } = require('discord.js');
const sqlActions = require('../sqlActions');
const { updateRoles } = require('../roles');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your UDisc name with your Discord account')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name associated with your UDisc account (Full name not handle)')
                .setRequired(true)),
	async execute(interaction) {

        const playerName = interaction.options.getString('name');
    
        let discordIDResult = await sqlActions.getPlayer(interaction.user.id, null); 
        if (discordIDResult) {
            //discord account already associated with player
            interaction.reply({
                content: `Account already linked to player ${discordIDResult.playerName}.`,
                ephemeral: true
            });
            return;
        }
        let playerNameResult = await sqlActions.getPlayer(null, playerName);
        if (playerNameResult) {
            //player exists in database
            sqlActions.register(interaction.user.id, playerName);

            interaction.reply(`Discord account successfully linked to player ${playerName}`)
            updateRoles();
        }
        else {
            //player does not exist
            interaction.reply({
                content: `Player ${playerName} not found. ` + 
                    `If you were given a tag, ask a league admin to add you to the system`,
                ephemeral: true
            });
        }
	},
};