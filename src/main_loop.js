const {STATE, t, split_str} = require('./core.js');

let history = [];

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

async function main_loop() {
    
    const id = STATE.node._.soul||STATE.node._.link;
    t.brightGreen('GunDB ');
    if (id) t.cyan(`${id}> `); else t.brightYellow(`*new*> `);

    const opts = { history, keyBindings, autoComplete, autoCompleteMenu: true };
    const input = await t.inputField(opts).promise;

    t('\n');
    if (!!input && input != "") {
        const cmd = split_str(input);
        if (STATE.COMMAND[cmd[0]]) {
            const result = await STATE.COMMAND[cmd[0]].run(cmd[1]);
            if (result === 'EXIT') return;
        } else {
            t.red(`unknown command: '${input}'\n`);
        }
        history.push(input);
    }
    await main_loop();
}

module.exports = { main_loop };