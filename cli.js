var argv = require("argv");
const netherfox = require("./index.js");
const rl = require("readline");

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

console.log(args.options.start)

if (args.options.name) {
    name = args.options.name;
}
else {
    //TODO: automatically select the name 
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
        fox.on("data", (message) => process.stdout.write(message));
    }

});
