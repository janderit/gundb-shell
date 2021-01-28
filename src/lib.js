// This is a library of command implementations which are also used internally.
const fs = require('fs');
const {STATE, t} = require('./core.js');
const {load_node, wait_for_node} = require('./load_node.js');

const MAXWAIT = 15;

async function wait_data() {
    const timeout = setTimeout(() => {
        t.white(`  Waiting for peer to send data (max ${MAXWAIT} secs)... \n\n`);
    }, 500);

    for (let i = 0; i<2*MAXWAIT; i++) {
        await load_node();
        const data = await wait_for_node(500);
        if (data) break;
    }

    clearTimeout(timeout);

    if (STATE.new_node) {
        t.brightYellow(`  This seems to be a new node or there is a connection issue.\n\n\n`);
    }
}

async function set_root(path) {
    if (!path || path === "") return;
    STATE.off();
    STATE.off = () => {};
    t.windowTitle(`GunDB shell - ${STATE.url} (${path})`);
    STATE.root = STATE.gun.get(path);
    STATE.node = STATE.root;
    await wait_data();
}

async function open_node(soul) {
    if (!soul || soul === "") return;
    STATE.off();
    STATE.off = () => {};
    STATE.node = STATE.gun.get(soul);
    t.brightYellow("  ! You are on a node outside the tree  !\n");
    t.brightYellow("  ! Do not cd .. beyond the opened node !\n");
    await wait_data();
}

function load_history() {
    return new Promise((res, rej) => {
        if (!fs.existsSync(STATE.historyfile)) {
            STATE.history = [];
            res();
            return;
        }
        fs.readFile(STATE.historyfile, 'utf8', (err,data) => {
            if(err) rej(err); else {
                STATE.history = JSON.parse(data);
                res();
            }
        });
    });
}

function save_history() {
    return new Promise((res, rej) => {
        fs.writeFile(STATE.historyfile, JSON.stringify(STATE.history), function(err) {
            if(err) rej(err); else res();
        }); 
    });
}


module.exports = {
    wait_data,
    set_root,
    open_node,
    load_history,
    save_history,
};