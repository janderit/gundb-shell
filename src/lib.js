// This is a library of command implementations which are also used internally.
const {STATE, t} = require('./core.js');
const {load_node, wait_for_node} = require('./load_node.js');

const MAXWAIT = 15;

async function wait_data() {
    const timeout = setTimeout(() => {
        t.white(`Waiting for peer to send data (max ${MAXWAIT} secs)... \n\n`);
    }, 500);

    for (let i = 0; i<2*MAXWAIT; i++) {
        await load_node();
        const data = await wait_for_node(500);
        if (data) break;
    }

    clearTimeout(timeout);

    if (STATE.new_node) {
        t.brightYellow(`This seems to be a new node or there is a connection issue.\n\n\n`);
    }
}

async function set_root(path) {
    STATE.off();
    STATE.off = () => {};
    t.windowTitle(`GunDB shell - ${STATE.url} (${path})`);
    STATE.root = STATE.gun.get(path);
    STATE.node = STATE.root;
    await wait_data();
}

module.exports = {
    wait_data,
    set_root,
};