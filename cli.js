const fs = require("fs");
const path = require("path");
const colors = require("colors");
var argv = require("argv");
const netherfox = require("./index.js");

var name, fox;

argv.version('1.0.0');
argv.option({
    name: 'name',
    short: 'n',
    type: 'string',
    description: 'The name of the Minecraft server',
    example: ""
});

argv.option({
    name: 'input',
    short: 'I',
    type: 'boolean',
    description: 'Take input from the terminal and forward it to the Minecraft server',
    example: ""
});

argv.option({
    name: 'output',
    short: 'O',
    type: 'boolean',
    description: 'Output the log from the Minecraft server',
    example: ""
});


argv.option({
    name: 'start',
    short: 's',
    type: 'boolean',
    description: 'Start the Minecraft server with the following start command',
    example: "netherfox -s java minecraft_server.jar"
});

argv.option({
    name: 'insert',
    short: 'i',
    type: 'boolean',
    description: 'Send the folowing commands directly to the Minecraft server',
    example: "netherfox -i stop"
});

argv.option({
    name: 'colours',
    short: 'c',
    type: 'boolean',
    description: 'Output a colourized version of the log',
    example: "netherfox -cIO"
});




var arguments = process.argv.slice(process.argv[0] == "netherfox" ? 1 : 2)
var startCmd = [];

var pos = Math.max(arguments.indexOf("-s"), arguments.indexOf("-s"));

if (pos > -1) {
    startCmd = arguments.slice(pos + 1);
    arguments = arguments.slice(0, pos + 1);
}



const args = argv.run(arguments);
var persistent = args.options.input || args.options.input;


if (args.options.name) {
    name = args.options.name;

    if (args.options.start && fs.existsSync(path.resolve(__dirname, netherfox.SOCK_DIR, name))) {
        console.error("server " + name + " is already running");
        process.exitCode = 1;
    }
    else if (!args.options.start && !fs.existsSync(path.resolve(__dirname, netherfox.SOCK_DIR, name))) {
        console.error("server " + name + " does not exist");
        process.exitCode = 1;
    }
}
else {
    if (args.options.start) {
        console.error("a server name must be specified");
        process.exitCode = 1;
    }
    else {

        var running_servers = fs.readdirSync(path.resolve(__dirname, netherfox.SOCK_DIR));

        if (running_servers.length === 0) {
            console.error("there is currently no server running");
            process.exitCode = 1;

        }

        if (running_servers.length === 1) {
            name = running_servers[0];
        }

        if (running_servers.length > 1) {
            console.error("there are currently more than one servers running. Please specify a server name");
            process.exitCode = 1;

        }
    }

}



if (!process.exitCode && args.options.start) {
    if (args.options.insert) {
        console.error("--start and --insert flags are not allowed at the same time")
        process.exitCode = 1;
    }
    else {

        netherfox.start(name, startCmd);
    }
}



if (!process.exitCode && (args.options.insert || args.options.input || args.options.output)) fox = netherfox.connect(name, () => {

    process.stdin.setEncoding("utf8");


    if (!process.exitCode && args.options.insert) {
        
        fox.write(args.targets.join(" "));
    }

    if (!process.exitCode && args.options.input) {

        process.stdin.on("data", (message) => fox.write(message.trim()));
    }

    if (!process.exitCode && args.options.output) {
        if (args.options.colours) {
            fox.on("data", (message) => {
               let parsed = netherfox.parseLog(message);
                process.stdout.write(("[" + parsed.time.h + ":" + parsed.time.m + ":" + parsed.time.s + "] ").gray);
                process.stdout.write("[".white + parsed.thread.yellow + "/".white + parsed.type.yellow + "] ".white);

                if (parsed.message.startsWith("[STDERR]")) process.stdout.write(parsed.message.red);

                else if (parsed.message[0] === "<") process.stdout.write(parsed.message.slice(0, parsed.message.indexOf(">")).blue + parsed.message.slice(parsed.message.indexOf(">")).cyan)
                else process.stdout.write(parsed.message.white);

            });
        }
        else {
            fox.on("data", (message) => process.stdout.write(message));
        }


    }
    if (!persistent) fox.end();

});
else process.exit();
