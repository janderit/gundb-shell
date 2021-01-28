function load_env_or_die() {
    const url = process.env['GUN_URL'];
    const root = process.env['GUN_ROOT'];
    const no_history = process.env['NO_HISTORY'];

    if (!url || !root) {
        if (!url) {
            t.red(" required environment variable ")
            t.brightRed("GUN_URL")
            t.red(" missing. Please specify the url of the peer to connect to.\n")
        }
        if (!root) {
            t.red(" required environment variable ")
            t.brightRed("GUN_ROOT")
            t.red(" missing. Please specify the soul of your root node.\n")
        }
        process.exit(1);
    }

    return {url, root, no_history};
}

module.exports = { load_env_or_die };