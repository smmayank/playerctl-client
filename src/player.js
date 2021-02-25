const { getMetadataValue, execCommand } = require('./shellClient');

const getPlayerMetadata = async (player) => {
    const metadata = {
        album: await getMetadataValue(player, 'album'),
        artist: await getMetadataValue(player, 'artist'),
        title: await getMetadataValue(player, 'title'),
        artUrl: await getMetadataValue(player, 'mpris:artUrl'),
        length: await getMetadataValue(player, 'mpris:length'),
        position: await getMetadataValue(player, 'position'),
        status: await getMetadataValue(player, 'status'),
    }
    metadata.percent = parseInt(metadata.position / metadata.length * 100);
    return metadata;
}

const getPlayers = async () => {
    const players = await execCommand(`${process.env.PLAYERCTL} -l`);
    const playersList = players.split(/\s+/);
    return playersList;
}


const toggleStatus = () => {
    execCommand(`${process.env.PLAYERCTL} play-pause`)
}

const moveNext = () => {
    execCommand(`${process.env.PLAYERCTL} next`)
}

const movePrevious = () => {
    execCommand(`${process.env.PLAYERCTL} previous`)
}

module.exports = {
    getPlayerMetadata,
    getPlayers,
    toggleStatus,
    moveNext,
    movePrevious,
}