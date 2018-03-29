const NeDb = require('nedb');
const Path = require('path');
const electron = require('electron');

class DataStoreAdapter {
    static neDb() {
        return {
            auth: {
                github: new NeDb({filename: Path.join(electron.app.getPath('home'), '.washi/db/auth/github.db'), autoload: true })
            },
            user: {
                repos: new NeDb({filename: Path.join(electron.app.getPath('home'), '.washi/db/user/github/repos.db'), autoload: true })
            }
        };
    }
}

module.exports = DataStoreAdapter;