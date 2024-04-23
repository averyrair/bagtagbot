const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../db');

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
        
        let discordIDResult = await new Promise((resolve, reject) => {
            db.query(
                `call getPlayer(
                    ${db.escape(interaction.user.id)},
                    null
                )`,
            (err, results) => {
                return err ? reject(err) : resolve(results[0][0]);
            });
        });

        if (discordIDResult) {
            //discord account already associated with player
            interaction.reply({
                content: `Account already linked to player ${discordIDResult.playerName}.`,
                ephemeral: true
            });
            return;
        }

        let playerNameResult = await new Promise((resolve, reject) => {
            db.query(
                `call getPlayer(
                    null,
                    ${db.escape(playerName)}
                )`,
            (err, results) => {
                return err ? reject(err) : resolve(results[0][0]);
            });
        });
        
        if (playerNameResult) {
            //player exists in database
            db.query(
                `call registerDiscord(${db.escape(interaction.user.id)}, 
                ${db.escape(playerName)})`
            );

            interaction.reply(`Discord account successfully linked to player ${db.escape(playerName)}`)
        }
        else {
            //player does not exist
            interaction.reply({
                content: `Player ${db.escape(playerName)} not found.` + 
                    `If you were given a tag, ask a league admin to add you to the system`,
                ephemeral: true
            });
        }
	},
};