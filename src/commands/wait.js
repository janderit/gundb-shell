const {STATE} = require('../core.js');
const {wait_data} = require('../lib.js');

const help = [
    "wait",

    "Actively waits for the node data to be synced.",
    "Use this if you are at a node that is supposed to have data but shows as *new node*.",
];

async function run() {
    await wait_data();
}

STATE.COMMAND.wait = { run, help };
