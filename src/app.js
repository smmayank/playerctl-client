const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const util = require('util');
require('dotenv').config();
const exec = util.promisify(require('child_process').exec);

const execResult = async (command) => {
  try {
    const req = await exec(command);
    return req.stdout.trim();
  } catch (err) {
    console.error(err);
    return '';
  }
}

const fetchMeta = async (player, meta) => {
  const metaValue = await execResult(`${process.env.PLAYERCTL} -p ${player} metadata -f "{{${meta}}}"`)
  return metaValue;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  if (process.env.DEV) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('previous-button-clicked', (event, ...args) => {
  execResult(`${process.env.PLAYERCTL} -p ${currentPlayer} previous`)
})

ipcMain.handle('play-pause-button-clicked', (event, ...args) => {
  execResult(`${process.env.PLAYERCTL} -p ${currentPlayer} play-pause`)
})

ipcMain.handle('next-button-clicked', (event, ...args) => {
  execResult(`${process.env.PLAYERCTL} -p ${currentPlayer} next`)
})



let currentPlayer = undefined;

setInterval(async () => {
  const status = await execResult(`${process.env.PLAYERCTL} status`);
  const players = await execResult(`${process.env.PLAYERCTL} -l`);
  const playersList = players.split(/\s+/);
  currentPlayer ||= playersList[0];
  const metadatas = [];
  for (let i = 0; i < playersList.length; i++) {
    const metadata = {
      album: await fetchMeta(playersList[i], 'album'),
      artist: await fetchMeta(playersList[i], 'artist'),
      title: await fetchMeta(playersList[i], 'title'),
      artUrl: await fetchMeta(playersList[i], 'mpris:artUrl'),
      length: await fetchMeta(playersList[i], 'mpris:length'),
      position: await fetchMeta(playersList[i], 'position'),
      playerName: await fetchMeta(playersList[i], 'playerName'),
      status: await fetchMeta(playersList[i], 'status'),
    }
    metadatas.push(metadata)
  }
}, 1000);