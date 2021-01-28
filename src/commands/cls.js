const {STATE, t} = require('../core.js');

const help = [
    "cls",

    "clear screen",
];

async function run() {
    t.clear();
}

STATE.COMMAND.cls = { run, help };
