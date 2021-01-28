const {STATE, t} = require('../core.js');
const {load_node} = require('../load_node.js');
const {wait_data} = require('../lib.js');

const help = [
    "cd [<..|key>]",

    "Walks from the current node along the selected key.",
    "Use 'cd ..' to walk back up one node and 'cd' to walk back to the root.",
];

function cd_autocomplete(inputString) {
    const r = Object.keys(STATE.edges).filter(_ => _.startsWith(inputString));
    if (r.length === 0) return inputString;
    if (r.length === 1) return r[0];
    return r;
}

async function cd(path) {
    if (STATE.props[path]) {
        t.red(`cannot cd into value\n`);
        return;
    }
    if (!path || path === "") {
        STATE.node = STATE.root;
    } else if (path === '..') {
        STATE.node = STATE.node.back();
    } else {
        if (!STATE.edges[path]) {
            t.red(`this edge does not seem to exist,\nuse md to create an edge to a new node or\nuse wait to wait to an edge which should be there\n`);
            return;
        }
        STATE.node = STATE.node.get(path);
    }
    await load_node();
    await wait_data();
}

STATE.COMMAND.cd = { run: cd, autoComplete: cd_autocomplete, help };
