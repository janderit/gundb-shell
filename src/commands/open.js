const {STATE} = require('../core.js');
const {open_node} = require('../lib.js');

const help = [
    "open <soul>",

    "Temporarily opens a node outside of the root tree.",
    "It is your own responsibility *not* to 'cd ..' beyond that node.",
    "Use 'cd' to return to your root.",
];

async function run(path) {
    await open_node(path);
}

STATE.COMMAND.open = { run, help };
