const util = require('util');
const exec = util.promisify(require('child_process').exec);

const execCommand = async (command) => {
    try {
        const req = await exec(command);
        return req.stdout.trim();
    } catch (err) {
        return '';
    }
};

const getPlayers = async () => {
    const players = await execCommand(`${process.env.PLAYERCTL} -l`);
    const playersList = players.split(/\s+/);
    return playersList;
};

const getMetadataValue = async (player, meta) => {
    const metaValue = await execCommand(`${process.env.PLAYERCTL} -p ${player} metadata -f "{{${meta}}}"`);
    return metaValue;
};

const togglePlayingStatus = async (player) => {
    execCommand(`${process.env.PLAYERCTL} -p ${player} play-pause`);
};

const skip = async (player) => {
    execCommand(`${process.env.PLAYERCTL} -p ${player} next`);
};

const previous = async (player) => {
    execCommand(`${process.env.PLAYERCTL} -p ${player} previous`);
};

module.exports = {
    getPlayers,
    getMetadataValue,
    togglePlayingStatus,
    skip,
    previous,
};
