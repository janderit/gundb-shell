const Gun = require('gun');
const {STATE} = require('./core.js');

function wait_for_node(timeout) {
    return new Promise((res) => {
        if (!STATE.new_node) {
            res(true);
            return;
        }

        const to = setTimeout(() => {
            res(!STATE.new_node);
        }, timeout);

        STATE.ondata = () => {
            clearTimeout(to);
            res(true);
        };
    });
}

async function load_node() {
    STATE.off();

    STATE.props = {};
    STATE.edges = {};
    STATE.new_node = true;

    STATE.is_root = (STATE.node._.soul || STATE.node._.link) === (STATE.root._.soul || STATE.root._.link);

    let active = true;
    STATE.off = () => active = false;

    STATE.node.map().on((v,k,_,ev) => {
        if (!active) return;
        STATE.new_node = false;
        STATE.off = () => {
            active = false;
            ev.off();
        };
        if (Gun.node.is(v)) {
            STATE.edges[k] = v;
        } else {
            STATE.props[k] = v;
        }
        if (STATE.ondata) {
            STATE.ondata();
            STATE.ondata = undefined;
        }
    });
}

module.exports = { load_node, wait_for_node};