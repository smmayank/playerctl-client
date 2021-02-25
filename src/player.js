const {
    getMetadataValue, getPlayers, togglePlayingStatus, skip, previous,
} = require('./playerClient');

let currentPlayer;

const getPlayerMetadata = async (player) => {
    const metadata = {
        album: await getMetadataValue(player, 'album'),
        artist: await getMetadataValue(player, 'artist'),
        title: await getMetadataValue(player, 'title'),
        artUrl: await getMetadataValue(player, 'mpris:artUrl'),
        length: parseInt(await getMetadataValue(player, 'mpris:length'), 10),
        position: parseInt(await getMetadataValue(player, 'position'), 10),
        status: await getMetadataValue(player, 'status'),
        playerName: player,
    };
    metadata.percent = parseInt(100 * (metadata.position / metadata.length), 10);
    return metadata;
};

const refreshUi = async (event) => {
    const players = await getPlayers();
    const playersMeta = await Promise.all(players.map((p) => getPlayerMetadata(p)));
    const metadata = {};
    for (let i = 0; i < playersMeta.length; i += 1) {
        const currentPlayerMeta = playersMeta[i];
        currentPlayer = currentPlayer || currentPlayerMeta.playerName;
        metadata[currentPlayerMeta.playerName] = currentPlayerMeta;
    }
    event.reply('refresh-matadata', { currentPlayer, metadata });
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
