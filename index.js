const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { client } = require('./bot');
const { db } = require('./db');
require('dotenv').config();

db.connect((err) => {
    if (err) throw err
    console.log('MySQL connected...');
});

//slash command setup
client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

//interactions setup
client.interactions = new Discord.Collection();
const interactionPath = path.join(__dirname, 'interactions');
const interactionFiles = fs.readdirSync(interactionPath).filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
    const filePath = path.join(interactionPath, file);
    const interactionModule = require(filePath);
    client.interactions.set(interactionModule.interactionID, interactionModule);
}

//event handler setup
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//login to the bot account
client.login(process.env.DISCORD_BOT_KEY);