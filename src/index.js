import Gun from 'gun';
import { STATE, t } from './core.js';
import { load_node } from './load_node.js';
import { main_loop } from './main_loop.js';
import { load_env_or_die } from './loadenv.js';

import './commands/exit.js';
import './commands/ls.js';
import './commands/cd.js';
import './commands/put.js';
import './commands/help.js';

t.brightWhite(`\n\nGunDB shell\n\n`);

const {url, root} = load_env_or_die(); 

// shim to display GunDB warnings
Gun.log = {once: (_, info) => {
    t.brightRed(`\n${info}\n`);
}};

const local = `./radata-${encodeURIComponent(url)}`;

const options = {
    peers: { [url]: {} },
    file: local,
};

let gun = Gun(options);
STATE.root = gun.get(root);
STATE.node = STATE.root;

setTimeout(()=>{
    t.windowTitle('GunDB shell - '+url);
    t.brightGreen(`\n\nWelcome to GunDB shell.\nYou are peered to '${url}'.\n\n`);
    t.brightGreen(`You are peered to '${url}' which may or may not be available at this time.\n`);
    t.brightGreen(`Your local data resides at '${local}'.\n\n`);
    t.white(` q for quit, h for help\n\n`);
    
    load_node().then(() => main_loop().then(() => {
        t('\nbye\n\n');
        process.exit(0);
    }).catch(e => {
        console.error(e);
        process.exit(1);
    }));

}, 50);
