window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron');

class MainRenderer{
    constructor() {
      this.githubToken = {};

    }

    async main() {
      await this.authorization();
      await this.selectedRepos();
    }

    selectedRepos() {
      return new Promise((resolve, reject) => {

        ipcRenderer.send('asynchronous-message', 'selected-repos');
        ipcRenderer.on('asynchronous-reply', (event, repos) =>{
          if (repos.length == 0 ) {
            ipcRenderer.send('asynchronous-message', 'move-repos-renderer');
          }
        });
      });
    }

    authorization() {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('asynchronous-message', 'auth');
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
          resolve(arg);
        })
      });
    }
}
module.exports = MainRenderer;

const renderer = new MainRenderer();
renderer.main();