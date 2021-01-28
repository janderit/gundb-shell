const Gun = require('gun');
const {STATE, t, sleep} = require('./core.js');
const {load_node, wait_for_node} = require('./load_node.js');
const {main_loop} = require('./main_loop.js');
const {load_env_or_die} = require('./loadenv.js');
const {set_root, wait_data} = require('./lib.js');

// shim to display GunDB warnings
Gun.log = {once: (_, info) => {
    t.brightRed(`\n${info}\n`);
}};

require('./commands/exit.js');
require('./commands/ls.js');
require('./commands/cd.js');
require('./commands/md.js');
require('./commands/put.js');
require('./commands/wait.js');
require('./commands/root.js');
require('./commands/help.js');

async function main() {
    t.brightWhite(`\n\nGunDB shell\n\n`);

    const {url, root} = load_env_or_die(); 
    
    const local = `./radata-${encodeURIComponent(url)}`;
    
    const options = {
        peers: { [url]: {} },
        file: local,
    };
    
    STATE.url = url;
    STATE.gun = Gun(options);

    t.windowTitle(`GunDB shell`);

    await sleep(250); // <-- Gun(options) seems slow to init vs Gun(url), so we wait...

    t.brightGreen(`\n\nWelcome to GunDB shell.\nYou are peered to '${url}'.\n\n`);
    
    t.brightGreen(`You are peered to '${url}' which may or may not be available at this time.\n`);
    t.brightGreen(`Your local data resides at '${local}'.\n\n`);
    t.white(` q for quit, h for help\n\n`);
    
    await set_root(root);
    
    await main_loop();
}

main().then(() => {
    t('\ngood bye\n\n');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
