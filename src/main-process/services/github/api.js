const EventEmitter = require('events').EventEmitter;
const ApiClient = require('./api/client');


class ServicesGithubApi extends EventEmitter{
    constructor(token, mainWindow) {
        super();
        this.client = new ApiClient(token);
        this.mainWindow = mainWindow;
    }

    async getRepos() {
        const repos = await this.client.getRepos();
        console.log(repos);
    }
}
module.exports = ServicesGithubApi;