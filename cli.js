const fs = require("fs");

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
    description: 'Take input from the terminal and forward it to the ninecraft server',
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

const args = argv.run(process.argv.slice(process.argv[0] == "netherfox" ? 1 : 2));



if (args.options.name) {
    name = args.options.name;

    if (args.options.start && fs.existsSync("socks/" + name)) {
        console.error("server " + name + " is already running");
        process.exitCode = 1;
    }
}
else {
    if (args.options.start) {
        console.error("a server name must be specified");
        process.exitCode = 1;
    }
    else {
        //TODO: automatically select the name 

        var running_servers = fs.readdirSync("socks");

        if (running_servers.length === 0) {
            console.error("there is currently no server running");
            process.exitCode = 1;

        }

        if (running_servers.length === 1) {
            name = running_servers[0];
        }

        if (running_servers.length > 1) {
            console.error("there are currently more than one servers running. Please specify a servern name");
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

        netherfox.start("name", args.target);
    }
}



if (!process.exitCode) fox = netherfox.connect(name, () => {




    if (!process.exitCode && args.options.insert) {
        fox.write(args.target.join(" "));
    }

    if (!process.exitCode && args.options.input) {
        process.stdin.on("data", (message) => fox.write(message));
    }

    if (!process.exitCode && args.options.output) {
        if (args.options.colours) {
            fox.on("data", (message) => {
                let parsed = netherfox.parseLog(message);


            });
        }
        else {
            fox.on("data", (message) => process.stdout.write(message));
        }


    }

});
