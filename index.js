const { Socket } = require("net");

const EventEmitter = require('events');
const cp = require("child_process");
const path = require("path");

const SOCK_DIR = "socks";

module.exports = {

    /* The start method spawns spawner.js in detached mode which then executes the bypassed command */
    start: function (name, cmd) {
        console.log(path.resolve(SOCK_DIR,name))
        cp.spawn("node", [path.resolve(__dirname + "/spawner.js"), path.resolve(__dirname, SOCK_DIR, name)].concat(cmd), { detached: true, stdio: "ignore" });
    },

    /* The parse method analyzes a log entry */
    parseLog: function (log) {
        return {

            time: {
                h: parseInt(log.slice(1, 3)),
                m: parseInt(log.slice(4, 6)),
                s: parseInt(log.slice(7, 9)),
            },

            thread: log.slice(12, log.indexOf('/')),

            type: log.slice(log.indexOf('/') + 1, log.indexOf(']', 16)),

            message: log.slice(log.indexOf(']', 16) + 3)

        }
    },

    /* The connect method establishes a connection to the server and returns a Fox instance via callback 
       I know I should not put all the logic in here, but I want to get it work quickly */
    connect: function (name) {
        let fox = new Socket();

        fox.port = null;
        fox.name = null;
        fox.connected = false;

        /* The send method sends the data through the socket to the minecraft server */
        fox.send = function (msg) {
            this.write(msg);
        }

        /* The chat method sends a message to the server */
        fox.chat = function (msg) {
            this.send("say " + msg);
        }

        /* The stop method stops the server and spawner.js properly */
        fox.stop = function () {
            this.send("stop");
        }

        /* The getPlayers method returns a promise resolving an array containing the online players */
        fox.getPlayers = function () {
            return new Promise((resolve, reject) => {
                this.once("log", (msg) => {


                });
                this.send("list");
            });
        }

        fox.connect({ path: path.resolve(__dirname, SOCK_DIR, name) }, () => fox.connected = true);
        return fox;
    }

}
