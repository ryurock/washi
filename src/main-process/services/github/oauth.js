const BrowserWindow = require('electron').BrowserWindow;

const EventEmitter = require('events').EventEmitter;
const DbAdapter = require('../../data-store/adapter');
const GithubOAuthClient = require('./oauth/cliant');

class ServicesGithubOAuth extends EventEmitter{
    constructor(mainWindow) {
        super();
        this.mainWindow = mainWindow;
        this.db = DbAdapter.neDb().auth.github;
        this.client = new GithubOAuthClient();
    }

    async authorization() {
        let token = await this.getTokenFromDb();
        if (token == null) {
            this.emit('unauthorized');
            this.authWindow = new BrowserWindow({parent: this.mainWindow, show: true});
            this.authWindow.loadURL(this.client.authorizationUri());
            token = await this.authorizedToken();
            this.emit('authorized',token);
            this.db.insert({token: token});
            this.authWindow.close();
        } else {
            this.emit('authorized', token);
        }
    }

    async authorizedToken() {
        return new Promise((resolve, reject) => {
            const fetchAccessToken = async (url) => {
                const tokenState = await this.client.getToken(url);
                resolve(tokenState.token);
            };

            this.authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl ) => {
                fetchAccessToken(newUrl);
            });

            this.authWindow.webContents.on('will-navigate', (event, url) => {
                this.authWindow.show();
                fetchAccessToken(url);
            });
        });
    }

    async getTokenFromDb() {
        return new Promise(async (resolve, reject) =>{
            let tokenInfo = await this.db.findOne().sort({_id: -1}).exec((err, doc) => {
                if (err) {
                    this.emit('unauthorized');
                } else {
                    if (doc == null) {
                        resolve(null);
                    } else {
                        resolve(doc.token);
                    }
                }
            });
        });
    }

}

module.exports = ServicesGithubOAuth;