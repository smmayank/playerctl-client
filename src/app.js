require('dotenv').config();
const {
    app, BrowserWindow, ipcMain, Tray, Menu,
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');
const player = require('./player');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let tray;
let mainWindow;

const createTray = () => {
    tray = new Tray(path.join(__dirname, 'app.png'));
    const menuTemplate = [
        {
            label: 'Previous',
            click: () => {
                player.movePrevious();
            },
        },
        {
            label: 'Play / Pause',
            click: () => {
                player.toggleStatus();
            },
        },
        {
            label: 'Next',
            click: () => {
                player.moveNext();
            },
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            },
        },
    ];
    if (process.env.DEV) {
        menuTemplate.push({
            label: 'Open Dev Tools',
            click: () => {
                mainWindow.webContents.openDevTools({
                    mode: 'detach',
                });
            },
        });
    }
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    tray.setContextMenu(contextMenu);
};

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        maximizable: false,
        height: 205,
        width: 445,
        icon: path.join(__dirname, 'app.png'),
        resizable: !!process.env.DEV,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    ipcMain.handle('polling-refresh-data', () => player.getAllData());
    ipcMain.on('previous-button-clicked', () => {
        player.movePrevious();
    });
    ipcMain.on('play-pause-button-clicked', () => {
        player.toggleStatus();
    });
    ipcMain.on('next-button-clicked', () => {
        player.moveNext();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createTray();
    createWindow();
});

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
