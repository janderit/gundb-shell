const {STATE, t} = require('../core.js');
const {load_node} = require('../load_node.js');

const help = [
    "md <key>",

    "Walks from the current node along a new edge.",
    "Note that this doesn't create a new node yet,",
    "you need to actually set a value inside the new node.",
];

async function run(path) {
    if (STATE.props[path]) {
        t.red(`  ${path} already exists (it's a value)`);
        return;
    }
    if (STATE.edges[path]) {
        t.red(`  ${path} already exists (it's an edge), use cd instead.`);
        return;
    }
    if (!!path && path !== "" && path !== "..") {
        STATE.node = STATE.node.get(path);
        await load_node();
    }
}

STATE.COMMAND.md = { run, help };
