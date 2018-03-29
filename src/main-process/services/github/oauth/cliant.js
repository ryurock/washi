const SecretOAuth  = require('../../../../../config/secret.json').oauth.github;
const QueryString  = require('querystring');
const Url          = require('url');
const SimpleOAuth2 = require('simple-oauth2');

class GithubOAuthClient {
    constructor() {
        this.credentials = SecretOAuth;
        this.auth = {
            tokenHost: 'https://github.com',
            tokenPath: '/login/oauth/access_token',
            authorizePath: '/login/oauth/authorize'
        };

        this.client = SimpleOAuth2.create({
            auth: this.auth,
            client: this.credentials
        });
    }

    authorizationUri() {
        return this.client.authorizationCode.authorizeURL({
            redirect_uri: 'https://localhost/oauth2callback',
            scope: 'notifications,repo',
            state: 'sc8xQBCqKE'
        });
    }

    async getToken(url) {
        const query = QueryString.parse(Url.parse(url).query);
        const options = {
            code: query.code,
            redirect_uri: "https://localhost/oauth2callback",
            scope: "notifications"
        }
        try {
            const result = await this.client.authorizationCode.getToken(options);
            return this.client.accessToken.create(result);
        } catch(error) {
            console.log(error);
        }
    }

    accessToken(tokenObject) {
        return this.client.accessToken.create(tokenObject);
    }
}
module.exports = GithubOAuthClient;