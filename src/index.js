const Gun = require('gun');
const {STATE, t, sleep} = require('./core.js');
const {main_loop} = require('./main_loop.js');
const {load_env_or_die} = require('./loadenv.js');
const {set_root, load_history, save_history} = require('./lib.js');

const MAXHISTORY = 1000;

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
require('./commands/cls.js');
require('./commands/help.js');

async function main() {
    t.brightWhite(`\n\nGunDB shell\n\n`);

    const {url, root, no_history} = load_env_or_die(); 
    
    const local = `./radata-${encodeURIComponent(url)}`;
    if (!no_history) STATE.historyfile = '.gundb-shell-history';
    
    const options = {
        peers: { [url]: {} },
        file: local,
    };
    
    STATE.url = url;
    STATE.gun = Gun(options);

    t.windowTitle(`GunDB shell`);

    await sleep(50);

    t.brightGreen(`\n\nWelcome to GunDB shell.\nYou are peered to '${url}'.\n\n`);
    
    t.brightGreen(`You are peered to '${url}' which may or may not be available at this time.\n`);
    t.brightGreen(`Your local data resides at '${local}'.\n\n`);
    t.white(` q for quit, h for help\n\n`);
    
    await set_root(root);
    
    if (!no_history) await load_history();
    await main_loop();
    if (!no_history) {
        if (STATE.history.length > MAXHISTORY) {
            STATE.history.splice(0, STATE.history.length - MAXHISTORY);
        }
        await save_history();
    }
}

main().then(() => {
    t('\ngood bye\n\n');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
