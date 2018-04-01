window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron')
class MainRenderer{
    constructor() {
    }

    async main() {
        ipcRenderer.send('asynchronous-message', 'fetch-orgazanation-list');
        ipcRenderer.on('asynchronous-reply', (event, repos) => {
            console.log(repos);
            const parentOrgList = document.getElementById('orgzanation-list');
            repos.map((repo, index) => {
                let node = document.createElement('div');
                node.classList.add('col-md-12');
                node.innerHTML = `
                <div class="card bg-dark">
                  <div class="card-body">
                    <div class="form-check js-project-list-row">
                    </div>
                  </div>
                </div>
                `;
                let content = node.getElementsByClassName('js-project-list-row')[0];
                content.innerHTML = `
                  <input class="form-check-input mt-2" type="checkbox" value="${index}" id="defaultCheck1">
                  <label class="form-check-label text-white h3" for="defaultCheck1">${repo.full_name}</label>
                `;
                parentOrgList.appendChild(node);
            });
        })

    }
}
module.exports = MainRenderer;

const renderer = new MainRenderer();
renderer.main();