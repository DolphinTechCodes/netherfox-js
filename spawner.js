const { spawn } = require("child_process");
const net = require("net");

process.title = "netherfox";

/* Create an IPC socket server which listens to the second cl parameter */
var sock = net.createServer().listen({

        path:process.argv[2],
        writableAll:true,
        readableAll:true
});
var listeners = [];

sock.on("connection", (conn) => {
    listeners.push(conn);
    //conn.setEncoding("utf8")
    conn.on("data", child.stdin.write);

});

sock.on("error",sock.close);



var child = spawn(process.argv[3], process.argv.slice(4));


child.stdout.on("data",(data)=>{for(let e of listeners) e.write(data)});
child.stderr.on("data",(data)=>{for(let e of listeners) e.write(data)});

process.on("exit",()=>{sock.close});
