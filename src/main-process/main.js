"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ServicesGithubOAuth = require('./services/github/oauth');
process.on('unhandledRejection', console.dir);

class MyApplication {
    constructor(app) {
        this.app = app;
        this.mainWindow = null;
        this.app.on('window-all-closed', this.onWindowAllClosed);
        this.app.on('ready', this.onReady);
    }
    onWindowAllClosed() {
        if (process.platform != 'darwin') {
            this.app.quit();
        }
    }
    onReady() {
        this.mainWindow = new BrowserWindow({
            width: 1024,
            height: 600,
            minWidth: 500,
            minHeight: 200,
            acceptFirstMouse: true
        });
        this.mainWindow.webContents.openDevTools();
        this.mainWindow.loadURL('file://' + __dirname + '/../renderer/main-window/index.html');

        ipcMain.on('asynchronous-message', (event, arg) => {
            if (arg == 'auth') {
                const auth = new ServicesGithubOAuth(this.mainWindow);
                auth.authorization();
                auth.on('unauthorized', () => {
                    console.log('unauthorized');
                    this.onWindowAllClosed();
                });
                auth.on('authorized', (token) =>{
                    event.sender.send('asynchronous-reply', token);
                });
            }
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}
const myapp = new MyApplication(app);
