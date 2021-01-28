const {STATE, t} = require('../core.js');
const { set_root } = require('../lib.js');
const {load_node} = require('../load_node.js');

const help = [
    "root <soul>",

    "Resets gundb-shell to a new root node.",
];

async function run(path) {
    await set_root(path);
}

STATE.COMMAND.root = { run, help };
