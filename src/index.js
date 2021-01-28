import T from 'terminal-kit';
import { S } from './schema.js';
const t = T.terminal;

const url = process.env['GUN_URL'] || 'http://localhost:8081/gun';
const ROOT = process.env['GUN_ROOT'] || `${S.Core.__}`;

function split_str(src) {
    const idx = src.indexOf(' ');
    if (idx === -1) return [src, undefined];
    return [src.substring(0, idx), src.substring(idx+1)];
}

import Gun from 'gun';
Gun.log = {once: (_, info) => {
    t.brightRed(`\n${info}\n`);
}};

const keyBindings = {
	ENTER: 'submit' ,
	KP_ENTER: 'submit' ,
	ESCAPE: 'cancel' ,
	BACKSPACE: 'backDelete' ,
    DELETE: 'backDelete' , // for MACOS, should probably by dependent on current OS...
    CMD: 'delete',
	LEFT: 'backward' ,
	RIGHT: 'forward' ,
	UP: 'historyPrevious' ,
	DOWN: 'historyNext' ,
	HOME: 'startOfInput' ,
	END: 'endOfInput' ,
	TAB: 'autoComplete' ,
	CTRL_R: 'autoCompleteUsingHistory' ,
	CTRL_LEFT: 'previousWord' ,
	CTRL_RIGHT: 'nextWord' ,
	ALT_D: 'deleteNextWord' ,
	CTRL_W: 'deletePreviousWord' ,
	CTRL_U: 'deleteAllBefore' ,
    CTRL_K: 'deleteAllAfter',
    CTRL_A: 'startOfInput' ,
}


const history = [];
let EXIT = false;

let gun;

let node;
let off = () => {};
let props = {};
let edges = {};
let new_node = false;

async function load_node() {
    props = {};
    edges = {};
    new_node = true;
    node.map().on((v,k,_,ev) => {
        if (new_node) t.move(0, t.y);
        new_node = false;
        off = () => ev.off();
        if (Gun.node.is(v)) {
            edges[k] = v;
        } else {
            props[k] = v;
        }
    });
}

async function exit() {
    EXIT = true;
    return 0;
}

function put_autocomplete(inputString) {
    if (inputString.indexOf(' ') >= 0) return inputString;
    const r = Object.keys(props).filter(_ => _.startsWith(inputString));
    if (r.length === 0) return inputString;
    if (r.length === 1) return r[0]+" ";
    return r;
}

async function put(path_value) {
    const [key, value] = split_str(path_value);
    if (value === undefined) {
        t.red(`missing value in 'put <key> <value>'\n`);
        return;
    }

    if (edges[key]) {
        t.red(`cannot replace node '${key}' with a value\n`);
        return;
    }
    const old = props[key];
    node.get(key).put(value);
    if (old !== undefined) {
        t.green(`replaced '${key}': '${old}' -> '${value}'.\n`);
    } else {
        t.green(`added '${key}': '${value}'.\n`);
    }
}

async function ls() {
    if (new_node) t.brightYellow('this is a new node. Putting values to the node will result in creation in the distributed database.\n');
    for (const k of Object.keys(props)) {
        t.brightCyan(` - ${k} :  ${props[k]}\n`);
    };
    for (const k of Object.keys(edges)) {
        t.brightBlue(` > ${k}\n`);
    };
}

function cd_autocomplete(inputString) {
    const r = Object.keys(edges).filter(_ => _.startsWith(inputString));
    if (r.length === 0) return inputString;
    if (r.length === 1) return r[0];
    return r;
}

async function cd(path) {
    if (props[path]) {
        t.red(`cannot cd into value\n`);
        return;
    }
    if (!path || path === "") {
        node = gun.get(ROOT);
    } else if (path === '..') {
        node = node.back();
    } else {
        node = node.get(path);
    }
    off();
    off = () => {};
    load_node();
}

async function help() {
    t.brightYellow(`\n\n  Help\n\n`);
    for (const key of Object.keys(COMMAND)) {
        if (COMMAND[key].help) {
            let first = true;
            for (const line of COMMAND[key].help) {
                t.brightYellow(`  ${(first ? "  " : "         ")}${line}\n`)
                first=false;
            }
            t('\n');
        }
    }
    t('\n');
}

const COMMAND = {
    exit: { run: exit},
    q: { run: exit, help: ["q | exit", "Exit the application."] },
    ls: { run: ls, help: ["ls","Displays the values and edges of the current node."] },
    cd: { run: cd, autoComplete: cd_autocomplete, help: ["cd [<..|key>]","Walks from the current node along the selected key.","Use 'cd ..' to walk back up one node and 'cd' to walk back to the root."] },
    h: { run: help, help: ["h","Shows this help."] },
    put: { run: put, autoComplete: put_autocomplete, help: ["put <key> <value>","Sets a value on the current node."] },
}

function autoComplete(inputString)
{  
    const cmd = split_str(inputString);
    if (cmd.length === 1) {
        const a = Object.keys(COMMAND).filter(_ => _.startsWith(inputString));
        if (a.length === 1) {
            return a[0]+" ";
        }
        if (a.length > 0) {
            return a;
        }
    } 
    else {
        if (COMMAND[cmd[0]] && COMMAND[cmd[0]].autoComplete) {
            const a = COMMAND[cmd[0]].autoComplete(cmd[1]);
            const prefix = cmd[0] + " ";
            if (typeof(a) === 'string') {
                return prefix+a;
            }
            a.prefix = prefix;
            return a;
        }
    }
    return inputString;
} ;

async function main_loop() {
    const id = Gun.node.soul(node)||node._.soul||node._.link;
    if (id) t.cyan(`${id}> `); else t.brightYellow(`*new*> `);
    const x = await t.inputField({history, keyBindings, autoComplete, autoCompleteMenu:true}).promise;
    t('\n');
    if (!!x && x != "") {
        const cmd = split_str(x);
        if (COMMAND[cmd[0]]) {
            await COMMAND[cmd[0]].run(cmd[1]);
        } else {
            t.red(`unknown command: '${x}'.\n`);
        }
        history.push(x);
    }
    if (!EXIT) await main_loop();
}

function start() {
    const startTimeout = setTimeout(() => {
        t.bgRed.white(`\n\nFailed to connect to GunDB WS at ${url}!\n\n`);
        process.exit(2);
    }, 5000);
    let running = false;
    t.windowTitle('Gun DB - connecting...');
    t.bgWhite.blue("\n\nGunDB shell\n\n");
    t.cyan(`connecting to Gun DB at ${url}...\n\n`);
    gun = Gun(url);
    node = gun.get(ROOT);
    node.once(_ => {
        if (running) return;
        running = true;
        clearTimeout(startTimeout);
        t.clear();
        t.windowTitle('Gun DB - '+url);
        t.brightGreen(`Welcome to GunDB shell.\nYou are connected to '${url}'.\n\n`);
        t.white(` q for quit, h for help\n\n`);
        load_node().then(() =>
        main_loop().then(() => {
            t('\nbye\n\n');
            process.exit(0);
        }).catch(e => {
            console.error(e);
            process.exit(1);
        }));
    });
}

start();