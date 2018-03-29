const octokit = require('@octokit/rest')();
const SecretGtihub  = require('../../../../../config/secret.json').github;

class ServicesGithubApiClient {
    constructor(token) {
        octokit.authenticate({
            type: 'integration',
            token: token.access_token
        });
        this.client = octokit;
    }

    async getRepos() {
        return new Promise(async (resolve, reject) =>{
            let response = await this.client.repos.getForOrg({
                org: SecretGtihub.orgazanation.name,
                type: SecretGtihub.orgazanation.type,
                per_page: 100
            });
            let { data } = response;
            while(this.client.hasNextPage(response)) {
                response = await this.client.getNextPage(response);
                data = data.concat(response.data);
            }
            resolve(data);
        });
    }
}
module.exports = ServicesGithubApiClient;