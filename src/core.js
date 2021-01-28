const {terminal:t} = require('terminal-kit');

const STATE = {
    url: '',
    historyfile: null,
    history: [],
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

function split_str(src, split_char) {
    const idx = src.indexOf(split_char || ' ');
    if (idx === -1) return [src];
    return [src.substring(0, idx), src.substring(idx+1)];
}

function reduce_parts(src, maxlen, prefix) {
    const orig = src;
    if (src.length <= maxlen) return src;
    while (src.length > maxlen && src.indexOf('/') >= 0) {
        const [_, rem] = split_str(src, '/');
        src = rem;
    }
    if (src.length > maxlen) {
        return prefix + src.substring(src.length - maxlen)
    } else {
        return prefix + "/" + src
    }
} 

function sleep(ms) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

module.exports = {t, STATE, split_str, sleep, reduce_parts};