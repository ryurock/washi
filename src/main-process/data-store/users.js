const DbAdapter = require('./adapter');

class DataStoreUser {
    constructor () {
        this.db = DbAdapter.neDb().user;
    }

    async fetchRepos(fields = []) {
        return new Promise((resolve, reject) => {
            this.db.repos.find({}, (err, responses) => {
                resolve(responses);
            });
        });
    }

}
module.exports = DataStoreUser;