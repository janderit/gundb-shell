const {STATE, t} = require('../core.js');
const { set_root } = require('../lib.js');
const {load_node} = require('../load_node.js');

const help = [
    "soul",

    "Display the full soul of the current node.",
];

async function run() {
    t.brightMagenta("  " + (STATE.node._.soul||STATE.node._.link));
}

STATE.COMMAND.soul = { run, help };
