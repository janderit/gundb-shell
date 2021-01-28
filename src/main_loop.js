const {STATE, t, split_str, reduce_parts} = require('./core.js');

const DELETE = process.platform === 'darwin' ? 'backDelete' : 'delete';

const keyBindings = {
	ENTER: 'submit' ,
	KP_ENTER: 'submit' ,
	ESCAPE: 'cancel' ,
	BACKSPACE: 'backDelete' ,
    DELETE,
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

function autoComplete(inputString)
{  
    const cmd = split_str(inputString);
    if (cmd.length === 1) {
        const candidates = Object.keys(STATE.COMMAND).filter(_ => _.startsWith(inputString));

        if (candidates.length === 0) {
            return inputString;
        }
        if (candidates.length === 1) {
            return candidates[0] + " ";
        }
        return candidates;
    }

    if (STATE.COMMAND[cmd[0]] && STATE.COMMAND[cmd[0]].autoComplete) {
        const candidates = STATE.COMMAND[cmd[0]].autoComplete(cmd[1]);

        const prefix = cmd[0] + " ";
        if (typeof(candidates) === 'string') {
            return prefix+candidates;
        }
        candidates.prefix = prefix;
        return candidates;
    }
}

function transform_prompt(id, rootid) {
    if (id === rootid) {
        id = "/";
    }
    const rooted = id.startsWith(rootid+"/");
    if (rooted) {
        id = id.substring(rootid.length);
        id = reduce_parts(id, 40, "/...")
    } else {
        id = reduce_parts(id, 40, "$...")
    }
    return id;
}

async function main_loop() {
    const id = STATE.node._.soul||STATE.node._.link;
    const rootid = STATE.root._.soul||STATE.root._.link;

    if (id) {
        t.cyan(`${transform_prompt(id, rootid)}> `);
    } else {
        t.brightYellow(`*new*> `);
    }

    const opts = { history: STATE.history, keyBindings, autoComplete, autoCompleteMenu: true };
    const input = await t.inputField(opts).promise;

    t('\n');
    if (!!input && input != "") {
        const cmd = split_str(input);
        if (STATE.COMMAND[cmd[0]]) {
            const result = await STATE.COMMAND[cmd[0]].run(cmd[1]);
            if (result === 'EXIT') return;
        } else {
            t.red(`  unknown command: '${input}'\n`);
        }
        STATE.history.push(input);
    }
    await main_loop();
}

module.exports = { main_loop };