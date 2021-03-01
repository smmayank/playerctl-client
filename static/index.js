// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const albumArtImage = document.getElementById('cover-image');
const artistText = document.getElementById('artist');
const albumText = document.getElementById('album');
const titleText = document.getElementById('title');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const playhead = document.getElementById('progress');
const timer = document.getElementById('elapsed');

pauseButton.style.display = 'none';

const refershUi = (data) => {
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
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline';
    } else {
        pauseButton.style.display = 'none';
        playButton.style.display = 'inline';
    }
    playhead.value = percent;
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

setInterval(() => {
    ipcRenderer.invoke('polling-refresh-data').then((data) => {
        refershUi(data);
    });
}, 1000);
