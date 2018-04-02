window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron')
class MainRenderer{
    constructor() {
        this.filterElem = document.getElementById('repos-filter');
    }

    async main() {
        ipcRenderer.send('asynchronous-message', 'fetch-orgazanation-list');
        ipcRenderer.on('asynchronous-reply', (event, repos) => {
            this.addRepos(repos);
        });
        this.addFilterEvent();
    }

    addFilterEvent() {
        this.filterElem.addEventListener('keyup', event => {
            let repoList = document.getElementsByClassName('js-repo-list-parent');
            let repos = [];
            for (let i = 0; i < repoList.length; i++) {
                let repoNode = repoList[i].querySelector('.form-check-input');
                let repoName = repoNode.getAttribute('data-full-name');
                if (repoName.indexOf(event.target.value) == -1) {
                    repoNode.parentNode.parentNode.parentNode.parentNode.classList.add('d-none');
                } else {
                    repoNode.parentNode.parentNode.parentNode.parentNode.classList.remove('d-none');
                }
            }
        });
    }

    addRepos(repos) {
        const parentOrgList = document.getElementById('orgzanation-list');
        repos.map((repo, index) => {
            let node = document.createElement('div');
            node.classList.add('col-md-12', 'js-repo-list-parent');
            node.innerHTML = `
            <div class="card bg-dark">
              <div class="card-body">
                <div class="form-check js-repo-list-row">
                </div>
              </div>
            </div>
            `;
            let content = node.getElementsByClassName('js-repo-list-row')[0];
            content.innerHTML = `
              <input class="form-check-input mt-2" type="checkbox" value="${index}" data-full-name="${repo.full_name}">
              <label class="form-check-label text-white h3" for="${repo.full_name}">${repo.full_name}</label>
            `;
            if (index == 0) {
                let elem = document.getElementById('repos-progress');
                elem.parentNode.removeChild(elem);
            }
            parentOrgList.appendChild(node);
        });
    }
    filter() {
        console.log('hoge');
    }
}
module.exports = MainRenderer;

const renderer = new MainRenderer();
renderer.main();