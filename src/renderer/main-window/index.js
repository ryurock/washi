window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron');

class MainRenderer{
  constructor() {
    this.githubToken = {};

  }

  async main() {
    ipcRenderer.send('asynchronous-message', 'auth');
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      if (arg.event_type == 'auth') {
        ipcRenderer.send('asynchronous-message', 'fetch-members');
        ipcRenderer.send('asynchronous-message', 'selected-repos');
        ipcRenderer.send('asynchronous-message', 'whoami');
      }

      if (arg.event_type == 'whoami') {
        document.querySelector('.js-avatar').setAttribute('src', arg.data.avatar_url);
      }

      if (arg.event_type == 'fetch-members') {
        if (arg.data.length == 0) {
          ipcRenderer.send('asynchronous-message', 'move-members-renderer');
        }
      }

      if (arg.event_type == 'selected-repos') {
        if (arg.data.length == 0 ) {
          ipcRenderer.send('asynchronous-message', 'move-repos-renderer');
        } else {
          console.log(arg);
        }
      }
    })
  }
}
module.exports = MainRenderer;

const renderer = new MainRenderer();
renderer.main();