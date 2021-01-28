import {STATE, t} from '../core.js';
import {load_node} from '../load_node.js'

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
        STATE.node = STATE.node.get(path);
    }
    load_node();
}

STATE.COMMAND.cd = { run: cd, autoComplete: cd_autocomplete, help };
