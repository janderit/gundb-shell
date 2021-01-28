const {STATE, t} = require('../core.js');

const help = [
    "ls",

    "Displays the values and edges of the current node.",
];

async function ls() {
    if (STATE.new_node) t.brightYellow('This is a new node. Putting values to the node will result in creation in the distributed database.\n');
    for (const k of Object.keys(STATE.props)) {
        t.brightCyan(` - ${k} :  ${STATE.props[k]}\n`);
    };
    for (const k of Object.keys(STATE.edges)) {
        t.brightBlue(` > ${k}\n`);
    };
}

STATE.COMMAND.ls = { run: ls, help };
