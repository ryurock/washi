"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ServicesGithubOAuth = require('./services/github/oauth');
const ServicesGithubApi   = require('./services/github/api');
const DataStoreUsers      = require('./data-store/users');

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
        const user = new DataStoreUsers();

        ipcMain.on('asynchronous-message', async (event, type, data) => {
            if (type == 'auth') {
                this.githubApi = null;
                const auth = new ServicesGithubOAuth(this.mainWindow);
                auth.authorization();
                auth.on('unauthorized', () => {
                    console.log('unauthorized');
                    this.onWindowAllClosed();
                });
                auth.on('authorized', (token) => {
                    this.githubApi = new ServicesGithubApi(token, this.mainWindow);
                    event.sender.send('asynchronous-reply', {event_type: 'auth', data: token});
                });
            }

            if (type == 'whoami') {
                const user = await this.githubApi.fetchUser();
                event.sender.send('asynchronous-reply', { event_type: 'whoami', data: user.data});
            }

            if (type == 'fetch-members') {
                const members = await user.fetchMembers();
                event.sender.send('asynchronous-reply', { event_type: 'fetch-members', data: members});
            }

            if (type == 'move-members-renderer') {
                this.mainWindow.loadURL(`file://${__dirname}/../renderer/main-window/members.html`);
            }

            if (type == 'fetch-members-direct') {
                const members = await this.githubApi.fetchMembers();
                event.sender.send('asynchronous-reply', {event_type: 'fetch-members-direct', data: members});
            }

            if (type == 'selected-repos') {
                let repos = await user.fetchRepos();
                event.sender.send('asynchronous-reply', {event_type: 'selected-repos', data: repos});
            }

            if (type == 'move-repos-renderer') {
                this.mainWindow.loadURL(`file://${__dirname}/../renderer/main-window/repos.html`);
            }

            if (type == 'move-main-renderer') {
                this.mainWindow.loadURL(`file://${__dirname}/../renderer/main-window/index.html`);
            }

            if (type == 'fetch-repo-list') {
                const repos = await this.githubApi.fetchRepos(['id', 'name', 'full_name']);
                event.sender.send('asynchronous-reply', {event_type: 'fetch-repo-list', data: repos});
            }

            if (type == 'save-repos') {
                user.deleteInsertRepos(data);
                const repos = await user.fetchRepos();
                event.sender.send('asynchronous-reply', { event_type: 'save-repos', data: repos});
            }
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}
const myapp = new MyApplication(app);
