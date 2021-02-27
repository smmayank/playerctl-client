const client = require('./client');

let currentPlayer;

const padNumber = (number, paddingLength = 2, paddingChar = '0') => {
    let result = `${number}`;
    while (result.length < paddingLength) {
        result = `${paddingChar}${number}`;
    }
    return result;
};

const computeElapsed = (timeInMicro) => {
    const seconds = parseInt((timeInMicro / 1000000) % 60, 10);
    const minutes = parseInt((timeInMicro / 60000000) % 60, 10);
    const hours = parseInt((timeInMicro / 3600000000) % 60, 10);
    if (hours > 0) {
        return `${hours}:${padNumber(minutes)}:${padNumber(seconds)}`;
    }
    if (minutes) {
        return `${minutes}:${padNumber(seconds)}`;
    }
    return `00:${seconds}`;
};

const getPlayerMetadata = async (player) => {
    const metadata = {
        album: await client.getMetadataValue(player, 'album'),
        artist: await client.getMetadataValue(player, 'artist'),
        title: await client.getMetadataValue(player, 'title'),
        artUrl: await client.getMetadataValue(player, 'mpris:artUrl'),
        length: parseInt(await client.getMetadataValue(player, 'mpris:length'), 10),
        position: parseInt(await client.getMetadataValue(player, 'position'), 10),
        status: await client.getMetadataValue(player, 'status'),
        playerName: player,
    };
    metadata.percent = parseInt(100 * (metadata.position / metadata.length), 10);
    metadata.elapsed = computeElapsed(metadata.position);
    return metadata;
};

const getAllData = async () => {
    const players = await client.getPlayers();
    const playersMeta = await Promise.all(players.map((p) => getPlayerMetadata(p)));
    const metadata = {};
    for (let i = 0; i < playersMeta.length; i += 1) {
        const currentPlayerMeta = playersMeta[i];
        currentPlayer = currentPlayer || currentPlayerMeta.playerName;
        metadata[currentPlayerMeta.playerName] = currentPlayerMeta;
    }
    return { currentPlayer, metadata };
};

const toggleStatus = () => {
    client.togglePlayingStatus(currentPlayer);
};

const moveNext = () => {
    client.skip(currentPlayer);
};

const movePrevious = () => {
    client.previous(currentPlayer);
};

module.exports = {
    getAllData,
    getPlayerMetadata,
    toggleStatus,
    moveNext,
    movePrevious,
};
