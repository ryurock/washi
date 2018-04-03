const ApiClient = require('./api/client');
const SecretGtihub  = require('../../../../config/secret.json').github;

class ServicesGithubApi {
    constructor(token, mainWindow) {
        this.client = new ApiClient(token).client;
        this.mainWindow = mainWindow;
    }

    responseFilter(data, fields = []) {
        if (fields.length > 0) {
            return data.map((v) => {
                let row = {};
                for (let key in v) {
                    if (fields.indexOf(key) !== -1) row[key] = v[key];
                }
                return row;
            });
        } else {
            return data;
        }
    }

    async fetchRepos(fields = []) {
        return new Promise(async (resolve, reject) =>{
            let responses = await this.client.repos.getForOrg({
                org: SecretGtihub.orgazanation.name,
                type: SecretGtihub.orgazanation.type,
                per_page: 100
            });

            let { data } = responses;
            while(this.client.hasNextPage(responses)) {
                responses = await this.client.getNextPage(responses);
                data = data.concat(responses.data);
            }
            resolve(this.responseFilter(data, fields));
        });
    }

    async fetchMembers(fields= []) {
        return new Promise(async (resolve, reject) => {
            let responses = await this.client.orgs.getTeams({
                org: SecretGtihub.orgazanation.name
            });

            let { data } = responses;
            while(this.client.hasNextPage(responses)) {
                responses = await this.client.getNextPage(responses);
                data = data.concat(responses.data);
            }

            resolve(this.responseFilter(data, fields));
        });
    }

    async fetchUser(fields = []) {
        return new Promise(async (resolve, reject) =>{
            resolve(this.responseFilter(this.client.users.get({}), fields));

        });

    }
}
module.exports = ServicesGithubApi;