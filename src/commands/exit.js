const {STATE} = require('../core.js');

async function run() {
    return 'EXIT';
}

STATE.COMMAND.exit = { run };
STATE.COMMAND.q = { run, help: ["q | exit", "Exit the application."] };
