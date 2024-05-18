const { client } = require("./bot")
const { getLeaderboard, getPlayer } = require("./sqlActions")

module.exports = {
    updateRoles
}

roles = [
    {lowerBound: 1, upperBound: 1, roleID: '1241506855638007891'},
    {lowerBound: 2, upperBound: 2, roleID: '1241506916652286063'},
    {lowerBound: 3, upperBound: 3, roleID: '1241507018150248559'},
    {lowerBound: 4, upperBound: 10, roleID: '1241507099989512354'}
]

async function updateRoles() {
    const leaderboard = await getLeaderboard()
    for (let i = 0; i < leaderboard.length; i++) {
        const playerInfo = await getPlayer(null, leaderboard[i].playerName)
        if (playerInfo.discordUID) {
            const member = await (await client.guilds.fetch('829382503767867392')).members.fetch(playerInfo.discordUID);
            const rolesToApply = roles.filter(role => role.lowerBound <= i+1 && role.upperBound >= i+1)
            const rolesToRemove = roles.filter(role => !rolesToApply.includes(role));
            for (role of rolesToApply) {
                const roleObject = await member.guild.roles.fetch(role.roleID);
                member.roles.add(roleObject);
            }
            for (role of rolesToRemove) {
                const roleObject = await member.guild.roles.fetch(role.roleID);
                member.roles.remove(roleObject);
            }
        }
    }
}