# gundb-shell - a GunDB terminal interface

## Why

Use gundb-shell to explore and manipulate your [GunDB](https://gun.eco/) graph.

Very early stage, here is the TODO list:

 - other values than strings
 - forgetting (nulling) values
 - linking to existing nodes
 - unlinking nodes
 - SEA support

## Usage

 ```bash
   npm install
   GUN_URL=http://localhost:8081/gun GUN_ROOT=my_root_soul npm start
 ```

gundb-shell requires two environment variables to be present:

 - `GUN_URL` is the url where a GunDB peer can be reached via a websocket upgrade. Remember that by convention, GunDB is hosted at `/gun`.
 - `GUN_ROOT` is the `soul` of your GunDB root node. gundb-shell will only operate on this root node.

Optional environment variables:
- `NO_HISTORY` inhibits persisting the command history to `.gundb-shell-history` if set.

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

    md <key>
           Walks from the current node along a new edge.
           Note that this doesn't create a new node yet,
           you need to actually set a value inside the new node.

    put <key> <value>
           Sets a value on the current node.

    wait
           Actively waits for the node data to be synced.
           Use this if you are at a node that is supposed to have data but shows as *new node*.

    root <soul>
           Resets gundb-shell to a new root node.

    cls
           clear screen

    h | help
           Shows this help.
```

## Notes
- The local peer data will be stored at the url-dependent location `./radata-<url>`. Use `rm -rf ./radata*` to purge.
- History is written to `.gundb-shell-history`.

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
