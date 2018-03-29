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
}
module.exports = ServicesGithubApiClient;