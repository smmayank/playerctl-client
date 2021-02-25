const {
    getMetadataValue, getPlayers, togglePlayingStatus, skip, previous,
} = require('./playerClient');

let currentPlayer;

const refreshUi = async (event) => {
    const players = await getPlayers();
    const metadata = {};
    for (let i = 0; i < players.length; i += 1) {
        const player = players[i];
        currentPlayer ||= player;
        metadata[player] = await getPlayerMetadata(player);
    }
    event.reply('refresh-matadata', { currentPlayer, metadata });
};

const getPlayerMetadata = async (player) => {
    const metadata = {
        album: await getMetadataValue(player, 'album'),
        artist: await getMetadataValue(player, 'artist'),
        title: await getMetadataValue(player, 'title'),
        artUrl: await getMetadataValue(player, 'mpris:artUrl'),
        length: await getMetadataValue(player, 'mpris:length'),
        position: await getMetadataValue(player, 'position'),
        status: await getMetadataValue(player, 'status'),
    };
    metadata.percent = 100 * Math.floor(metadata.position / metadata.length);
    return metadata;
};

const toggleStatus = (event) => {
    togglePlayingStatus(currentPlayer);
    refreshUi(event);
};

const moveNext = (event) => {
    skip(currentPlayer);
    refreshUi(event);
};

const movePrevious = (event) => {
    previous(currentPlayer);
    refreshUi(event);
};

module.exports = {
    refreshUi,
    getPlayerMetadata,
    getPlayers,
    toggleStatus,
    moveNext,
    movePrevious,
};
