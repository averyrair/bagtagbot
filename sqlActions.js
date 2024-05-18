const { db } = require('./db');

module.exports = {
    getPlayer,
    register,
    distributeTag,
    getLeaderboard,
    getTagNum,
    swapTags,
    revokeTag,
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
    db.query(`call distributeTag(${db.escape(playerName)})`);
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

async function getTagNum(num) {
    return await new Promise((resolve, reject) => {
        db.query(
            `call getTagNumber(${db.escape(num)})`,
        (err, results) => {
            return err ? reject(err) : resolve(results[0][0]);
        });
    });
}

async function swapTags(tag1, tag2) {
    db.query(`call swapTags(${db.escape(tag1)}, ${db.escape(tag2)})`);
}

async function revokeTag(tagNum) {
    db.query(`call revokeTag(${db.escape(tagNum)})`);
}