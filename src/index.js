// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const albumArtImage = document.getElementById('album-art');
const artistText = document.getElementById('artist');
const albumText = document.getElementById('album');
const titleText = document.getElementById('title');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const playhead = document.getElementById('elapsed');
const timer = document.getElementById('timer');

pauseButton.style.visibility = 'hidden';

const refershUi = (event, data) => {
    const { currentPlayer, metadata } = data;
    const currentPlayerMetadata = metadata[currentPlayer];
    const {
        album, artist, title, artUrl, status, percent, elapsed,
    } = currentPlayerMetadata;
    albumArtImage.src = artUrl;
    albumText.innerHTML = album;
    artistText.innerHTML = artist;
    titleText.innerHTML = title;
    if (status === 'Playing') {
        pauseButton.style.visibility = 'visible';
        playButton.style.visibility = 'hidden';
    } else {
        playButton.style.visibility = 'visible';
        pauseButton.style.visibility = 'hidden';
    }
    playhead.style.width = `${percent}%`;
    timer.innerHTML = elapsed;
};

const togglePlay = () => {
    ipcRenderer.send('play-pause-button-clicked');
};
const moveNext = () => {
    ipcRenderer.send('next-button-clicked');
};
const movePrevious = () => {
    ipcRenderer.send('previous-button-clicked');
};

playButton.onclick = togglePlay;
pauseButton.onclick = togglePlay;
nextButton.onclick = moveNext;
previousButton.onclick = movePrevious;

ipcRenderer.on('refresh-matadata', refershUi);
ipcRenderer.send('polling-refresh-data');
setInterval(() => {
    ipcRenderer.send('polling-refresh-data');
}, 1000);
