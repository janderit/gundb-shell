# gundb-shell - a GunDB terminal interface

## Why

Use gundb-shell to explore and manipulate your [GunDB](https://gun.eco/) graph.

## Usage

 ```bash
   npm install
   GUN_URL=http://localhost:8081/gun GUN_ROOT=my_root_soul npm start
 ```

gundb-shell requires two environment variables to be present:

 - `GUN_URL` is the url where a GunDB peer can be reached via a websocket upgrade. Remember that by convention, GunDB is hosted at `/gun`.
 - `GUN_ROOT` is the `soul` of your GunDB root node. gundb-shell will only operate on this root node.

Note that `SEA` is not yet supported.

## Commands

```
    q | exit
           Exit the application.

    ls
           Displays the values and edges of the current node.

    cd [<..|key>]
           Walks from the current node along the selected key.
           Use 'cd ..' to walk back up one node and 'cd' to walk back to the root.

    put <key> <value>
           Sets a value on the current node.

    h | help
           Shows this help.

```

## Notes
The local peer data will be stored in the default location of `./radata`. Use `rm -rf ./radata` to purge.

## Kudos

A big thanks & lots of respect to [Mark Nadal](https://github.com/amark) for creating [GunDB](https://gun.eco/).

Find friendly GunDB people on [discord](http://chat.gun.eco/).

## Dependencies
 - awesome [GunDB](https://gun.eco/)
 - awesome [terminal-kit](https://github.com/cronvel/terminal-kit/)
  
and also
 - node.js
 - npm or [pnpm](https://pnpm.js.org) or yarn

## License

see [LICENSE.md](./LICENSE.md)
