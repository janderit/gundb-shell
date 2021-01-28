# dbd - a GunDB terminal interface

## Why

Use dbd to inspect and manipulate your [GunDB](https://gun.eco/)  

## Usage

 *assuming [pnpm](http://pnpm.js.org), will also work with npm or yarn*

 ```
   $ GUN_URL=http://localhost:8081/gun GUN_ROOT=my_root_soul pnpm start
 ```

dbd requires two environment variables to be present:

 - `GUN_URL` is the url where a GunDB peer can be reached via a websocket upgrade. Remember that by convention, GunDB is hosted at `/gun`.
 - `GUN_ROOT` is the `soul` of your GunDB root node. dbd will only operate on this root node.

Note that `user` is not yet supported.

## Commands

```
    q | exit
           Exit the application.

    ls
           Displays the values and edges of the current node.

    cd [<..|key>]
           Walks from the current node along the selected key.
           Use 'cd ..' to walk back up one node and 'cd' to walk back to the root.

    h
           Shows this help.

    put <key> <value>
           Sets a value on the current node.

```

## Kudos

Thanks & respect to [Mark Nadal](https://github.com/amark) for creating [GunDB](https://gun.eco/).

Find friendly GunDB people on [discord](http://chat.gun.eco/).

## License

as-is, no-warrenty, your-own-responsibility, do-as-you-like, PRs will fall under this common domain copy left clause
