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
        await db.execute(
            `call registerPlayer(
                ${db.escape(interaction.user.id)},
                ${db.escape(interaction.options.getString('name'))}
            )`
        );

        let result = await new Promise((resolve, reject) => {
            db.query(
                `call getPlayer(
                    ${db.escape(interaction.user.id)},
                    null
                )`,
            (err, results) => {
                return err ? reject(err) : resolve(results);
            });
        });

        interaction.reply(`Registered with Tag #${result[0][0].tagNum}`);
	},
};