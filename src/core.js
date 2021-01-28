import Terminal from 'terminal-kit';
export const t = Terminal.terminal;

export const STATE = {
    COMMAND: {}, // shell command definitions will be registered here
    root: undefined, // the gundb root node specified by the GUN_ROOT env var
    node: undefined, // the current node
    edges: {}, // the edges of the current node
    props: {}, // the value properties of the current node
    new_node: false, // flagging the current node as unknown  
    off: () => {}, // unsubscribe handler for the current node
};

export function split_str(src) {
    const idx = src.indexOf(' ');
    if (idx === -1) return [src, undefined];
    return [src.substring(0, idx), src.substring(idx+1)];
}
