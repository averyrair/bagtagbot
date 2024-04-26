const { db } = require('./db');

module.exports = {
    getPlayer,
    register,
    distributeTag,
    getLeaderboard,
}

async function getPlayer (discordID, playerName) {

    return await new Promise((resolve, reject) => {
        db.query(
            `call getPlayer(
                ${db.escape(discordID)},
                ${db.escape(playerName)}
            )`,
        (err, results) => {
            return err ? reject(err) : resolve(results[0][0]);
        });
    });
}

async function register (discordID, playerName) {
    db.query(
        `call registerDiscord(${db.escape(discordID)}, 
        ${db.escape(playerName)})`
    );
}

async function distributeTag (playerName) {
    db.query(`call distributeTag(${db.escape(playerName)})`)
}

async function getLeaderboard() {
    return await new Promise((resolve, reject) => {
        db.query(
            `call getLeaderboard()`,
        (err, results) => {
            return err ? reject(err) : resolve(results[0]);
        });
    });
}