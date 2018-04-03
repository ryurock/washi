window.jQuery = window.$ = require('jquery');
require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../../../node_modules/popper.js/dist/umd/popper.min.js');

const {ipcRenderer} = require('electron')
class MemberRenderer{
    constructor() {
        this.filterElem = document.getElementById('repos-filter');
        this.teamSelectedButtonElem = document.getElementsByClassName('js-select-teams-click')[0];
    }

    async main() {
        ipcRenderer.send('asynchronous-message', 'fetch-members-direct');
        ipcRenderer.on('asynchronous-reply', (event, args) => {
            if (args.event_type == 'fetch-members-direct') {
                this.addTeams(args.data);
            }
            // if (args.event_type == 'save-repos') {
            //     ipcRenderer.send('asynchronous-message', 'move-main-renderer');
            // }
        });
        this.addFilterEvent();
        this.addEventSelectTeamOnClick();
    }

    addEventSelectTeamOnClick() {
        this.teamSelectedButtonElem.addEventListener('click', event =>{
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

    onTeamChecked(event) {
        console.log(event.target);
        team_id = event.target.getAttribute('data-id');
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

    addTeams(members) {
        const parentMemberList = document.getElementById('member-list');
        members.map((member, index) => {
            let node = document.createElement('div');
            node.classList.add('col-md-12');
            node.innerHTML = `
            <div class="card bg-dark">
              <div class="card-body">
                <div class="form-check js-member-list-row">
                </div>
              </div>
            </div>
            `;
            let content = node.getElementsByClassName('js-member-list-row')[0];
            content.innerHTML = `
              <input class="form-check-input mt-2" type="radio" value="${index}" data-name="${member.name}" data-id="${member.id}">
              <label class="form-check-label text-white h3" for="${member.name}">${member.name}</label>
            `;
            let elem = content.getElementsByClassName('form-check-input')[0];
            elem.addEventListener('click', this.onTeamChecked);

            if (index == 0) {
                let elem = document.getElementById('progress');
                elem.parentNode.removeChild(elem);
            }
            parentMemberList.appendChild(node);
        });
    }
    filter() {
        console.log('hoge');
    }
}
module.exports = MemberRenderer;

const renderer = new MemberRenderer();
renderer.main();