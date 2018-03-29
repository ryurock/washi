window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron')
class MainRenderer{
    constructor() {
      this.githubToken = {};

    }

    async main() {
      const token = await this.authorization();
    }
    authorization() {
      return new Promise((resole, reject) => {
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