const { createConnection } = require("net");

const EventEmitter = require('events');
const cp = require("child_process");




const SOCK_LOC = __dirname + "/socks/";

var sock;

class Fox extends EventEmitter {

    constructor() {
        super();
        this.port = null;
        this.name = null;
        this.catched = false;


    }
    /* as long as there is no connection to the server, the input methods will simply return false */
    send(msg) { return false }
    chat(msg) { return false }
    stop() { return false }

    /* the "catch" method establishes a connection to the minecraft server and re-assigns the input methods */
    catch(name, cb) {
        var self = this;
        this.name = name;
        this.catched = true;

        /* Open the communication socket */
        sock = createConnection(__dirname + name);
        sock.on("data", (data) => self.emit("log", data));
        sock.on("end", () => self.emit("release"));




        //this.emit("log", null);

        this.send = function (msg) {


        }

        this.chat = function (msg) {
            this.send("say " + msg);
        }

        this.stop = function () {
            this.send("stop");
        }

    }

    /* The release method disconnects from the server and removes the now invalid functions*/
    release() {
        sock.end();
        delete this.send;
        delete this.say;
        delete this.stop;
        this.catched = false;
    }


    /* The getPlayers method returns a promise resolving an array containing the online players */
    getPlayers() {
        return new Promise((resolve, reject) => {
            this.once("log", (msg) => {


            });
            this.send("list");
        });
    }

    /* The static sart method spawns spawner.js in detached mode which then executes the bypassed command */
    static start(name, cmd) {
        cp.spawn("node", [__dirname + "/spawner.js", __dirname + name], { detached: true, stdio: "ignore" });
    }

    /* the static parse method analyzes a log entry */
    static parse(log) {
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
    }
}

module.exports=Fox;