import Gun from 'gun';
import {STATE} from './core.js';

export async function load_node() {
    STATE.off();

    STATE.props = {};
    STATE.edges = {};
    STATE.new_node = true;

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
    });
}