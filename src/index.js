const { ipcRenderer } = require('electron')

const registerClick = (elementId) => {
  const element = document.getElementById(elementId);
  element.addEventListener('click', () => {
    ipcRenderer.invoke(`${elementId}-clicked`);
  })
};

registerClick('previous-button');
registerClick('play-pause-button');
registerClick('next-button');

ipcRenderer.on('refresh-matadata', (metadata) => {
  const { artUrl, title, album, artist } = { metadata };
});
