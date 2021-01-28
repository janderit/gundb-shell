const {terminal:t} = require('terminal-kit');

const STATE = {
    url: '',
    gun: null,
    COMMAND: {}, // shell command definitions will be registered here
    ondata: undefined, // internal callback
    root: undefined, // the gundb root node specified by the GUN_ROOT env var
    node: undefined, // the current node
    edges: {}, // the edges of the current node
    props: {}, // the value properties of the current node
    new_node: false, // flagging the current node as an unknown node
    is_root: false, // flagging the current node as the root node  
    off: () => {}, // unsubscribe handler for the current node
};

function split_str(src) {
    const idx = src.indexOf(' ');
    if (idx === -1) return [src];
    return [src.substring(0, idx), src.substring(idx+1)];
}

function sleep(ms) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

module.exports = {t, STATE, split_str, sleep};