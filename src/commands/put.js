const {STATE, t, split_str} = require('../core.js');

const help = [
    "put <key> <value>",

    "Sets a value on the current node.",
];

function put_autocomplete(inputString) {
    if (inputString.indexOf(' ') >= 0) return inputString;
    const r = Object.keys(STATE.props).filter(_ => _.startsWith(inputString));
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

    if (STATE.edges[key]) {
        t.red(`cannot replace node '${key}' with a value\n`);
        return;
    }

    const old = STATE.props[key];

    STATE.node.get(key).put(value);

    if (old !== undefined) {
        t.green(`replaced '${key}': '${old}' -> '${value}'.\n`);
    } else {
        t.green(`added '${key}': '${value}'.\n`);
    }
}

STATE.COMMAND.put = { run: put, autoComplete: put_autocomplete, help };
