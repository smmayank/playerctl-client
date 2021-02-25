// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const registerClick = (elementId) => {
    const element = document.getElementById(elementId);
    element.addEventListener('click', () => {
        ipcRenderer.send(`${elementId}-clicked`);
    });
};

registerClick('previous-button');
registerClick('play-pause-button');
registerClick('next-button');

ipcRenderer.on('refresh-matadata', (event, data) => {
    const { currentPlayer, metadata } = data;
    const currentPlayerMetadata = metadata[currentPlayer];
    const {
        album, artist, title, artUrl, status, percent,
    } = currentPlayerMetadata;
    document.getElementById('cover-image').src = artUrl;
    document.getElementById('seekbar').style.width = `${percent}%`;
    document.getElementById('title-text').innerHTML = `${title}`;
    document.getElementById('artist-text').innerHTML = `${artist}`;
    document.getElementById('album-text').innerHTML = `${album}`;
    document.getElementById('play-pause-button').innerHTML = status === 'Playing' ? 'Playing' : 'Paused';
});

setInterval(() => {
    ipcRenderer.send('polling-refresh-data');
}, 1000);
