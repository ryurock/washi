window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron')
class OrgazanationRenderer{
    constructor() {
        this.filterElem = document.getElementById('repos-filter');
        this.repoSelectedButtonElem = document.getElementsByClassName('js-select-repos-click')[0];
    }

    async main() {
        ipcRenderer.send('asynchronous-message', 'fetch-repo-list');
        ipcRenderer.on('asynchronous-reply', (event, args) => {
            if (args.event_type == 'fetch-repo-list') {
                this.addRepos(args.data);
            }
            if (args.event_type == 'save-repos') {
                ipcRenderer.send('asynchronous-message', 'move-main-renderer');
            }
        });
        this.addFilterEvent();
        this.addEventSelectReposOnClick();
    }

    addEventSelectReposOnClick() {
        this.repoSelectedButtonElem.addEventListener('click', event =>{
            const node = document.querySelectorAll('input.form-check-input');
            let repos = [];
            for ( let i = 0; i < node.length; i++) {
                if (node[i].checked) {
                    let repo = {full_name: node[i].getAttribute('data-full-name'), id: node[i].getAttribute('data-id')};
                    repos.push(repo);
                }
            };
            ipcRenderer.send('asynchronous-message', 'save-repos', repos);
        });

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
        const parentRepoList = document.getElementById('repo-list');
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
              <input class="form-check-input mt-2" type="checkbox" value="${index}" data-full-name="${repo.full_name}" data-id="${repo.id}">
              <label class="form-check-label text-white h3" for="${repo.full_name}">${repo.full_name}</label>
            `;
            if (index == 0) {
                let elem = document.getElementById('repos-progress');
                elem.parentNode.removeChild(elem);
            }
            parentRepoList.appendChild(node);
        });
    }
    filter() {
        console.log('hoge');
    }
}
module.exports = OrgazanationRenderer;

const renderer = new OrgazanationRenderer();
renderer.main();