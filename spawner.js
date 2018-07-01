const { spawn } = require("child_process");
const net = require("net");

process.title = "netherfox";

/* Create an IPC socket server which listens to the second cl parameter */
var sock = net.createServer().listen({

    path: process.argv[2],
    writableAll: true,
    readableAll: true
});
var listeners = [];

sock.on("connection", (conn) => {
    listeners.push(conn);

    conn.setEncoding("utf8")
    conn.on("data", (d) => child.stdin.write(d + "\n"));
    conn.on("close", () => { conn = null; listeners = listeners.filter(x => x) });
    conn.on("error", () => { conn = null; listeners = listeners.filter(x => x) });

});

sock.on("error", () => { sock.close(), process.exit() });



var child = spawn(process.argv[3], process.argv.slice(4));


child.stdout.on("data", (data) => { for (let e of listeners) e.write(data) });
child.stderr.on("data", (data) => { for (let e of listeners) e.write(data) });
child.on("close", () => { sock.close(), process.exit() });
child.on("exit", () => { sock.close(), process.exit() });

process.on("exit", () => { sock.close(), process.exit() });
process.on("SIGINT", () => { sock.close(), process.exit() });
