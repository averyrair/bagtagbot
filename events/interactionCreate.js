const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return;
            }

            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'there was an error executing this command.',
                    ephemeral: true
                });
            }
        }
        else {
            console.error(`unknown interaction type: ${interaction}`);
            await interaction.reply({
                content: 'there was an error executing this command.',
                ephemeral: true
            });
        }
    }
}