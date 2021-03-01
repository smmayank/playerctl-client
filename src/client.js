const util = require('util');
const exec = util.promisify(require('child_process').exec);

const playerctl = 'playerctl';

const execCommand = async (command) => {
    try {
        const req = await exec(command);
        return req.stdout.trim();
    } catch (err) {
        return `${err}`;
    }
};

const getPlayers = async () => {
    const players = await execCommand(`${playerctl} -l`);
    const playersList = players.split(/\s+/);
    return playersList;
};

const getMetadataValue = async (player, meta) => {
    const metaValue = await execCommand(`${playerctl} -p ${player} metadata -f "{{${meta}}}"`);
    return metaValue;
};

const togglePlayingStatus = async (player) => {
    execCommand(`${playerctl} -p ${player} play-pause`);
};

const skip = async (player) => {
    execCommand(`${playerctl} -p ${player} next`);
};

const previous = async (player) => {
    execCommand(`${playerctl} -p ${player} previous`);
};

module.exports = {
    getPlayers,
    getMetadataValue,
    togglePlayingStatus,
    skip,
    previous,
};
