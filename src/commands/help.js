import {STATE, t} from '../core.js';

const help = [
    "h | help",

    "Shows this help.",
];

async function run() {
    t.brightYellow(`\n\n  Help\n\n`);
    for (const key of Object.keys(STATE.COMMAND)) {
        if (STATE.COMMAND[key].help) {
            let first = true;
            for (const line of STATE.COMMAND[key].help) {
                t.brightYellow(`  ${(first ? "  " : "         ")}${line}\n`)
                first=false;
            }
            t('\n');
        }
    }
    t('\n');
}

STATE.COMMAND.help = { run };
STATE.COMMAND.h = { run, help };