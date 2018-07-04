# netherfox

Netherfox is a control and monitoring tool for minecraft servers written in JavaScript for Node.js. It provides a command line interface (CLI) for terminal  usage and an application programming interface (API) to integrate netherfox in e.g. a webinterface.

Netherfox starts a minecraft server once and then lets it run in the background as a child prpcess, where then later multiple other instances of netherfox (either via CLI or API) can connect to the specific IPC server and exchange input and output. One so-called 'spawner' (the program which is the parent process of the actual minecraft server) can have multiple other instances listening.
Also, the spawner immediately exits after the child process exits.

It is possible to have multiple servers running in parallel.

## Installation
//TODO
## API
Netherfox can be required using `const netherfox = require("netherfox");`

### Overview
```js
var netherfox = require("netherfox");

netherfox.start("server", ["java", "-Xmx1536M" "-jar", "server.jar", "nogui"]);
var server = netherfox.connect("server",()=>{
    
    server.on("data", console.log);

    server.say("hello world");
    server.send("give @a diamond");

    server.end();

});
```


### netherfox.start(name, command)
* `name` [String]: The name of the server and socket
* `command` [Array]: The start command to be executed

This function is used to start and enable further communication with a Minecraft server.

### netherfox.connect(name, callback)
* `name` [String]: The name of the server and socket
* `callback` [Function]: The function to be called when a connection is made
* Returns: [Socket] Socket with extra methods

Establishes a connection to the Minecraft server for communication and returns a socket bound to the IPC server. The socket has assigned some extra methods.

### Methods and Events of the socket
The following paragraphs describe how to use the netherfox Socket

### Socket.say(message)
* `message` [String]: The chat message to send

Sends the chat message to the IPC server. This equivalent to `Socket.send("say "+message);`.

### Socket.send(command)
* `command` [String]: The command to send

Sends the specified command to the IPC server.

### Socket.stop()

Sends a 'stop' command to the IPC server. This equivalent to `Socket.send("stop");`.

### socket.end()

Cuts the connection to the IPC server.


## CLI
When installed correctly, netherfox provides the command `netherfox`.


### Overview
```bash
$ netherfox -n server -s java -Xmx1536M -jar server.jar nogui
$ netherfox -IO
[14:18:12] [Server thread/INFO]: DolphinTech joined the game
[14:18:34] [Server thread/INFO]: <DolphinTech> hello world
say hey, dolphin
[14:18:37] [Server thread/INFO]: [Server] hey, dolphin
^C
$ netherfox -i say restart incoming
$ netherfox -i stop
$ netherfox -n server -s java -Xmx1536M -jar server.jar nogui
```

### Argument `-s  [start command]`
Short form for `--start`

Starts the server with the specified start command. This flag has to be the last one in a netherfox command and *requires a server name specified with `-n`*.

Example: `netherfox -n server -s java -Xmx1536M -jar server.jar nogui`
### Argument `-n  [sever name]`
Short form for `--name`

Specifies the server name needed for further operations. It can be omitted if there is currently only one server running.

Example: `netherfox -n server -O`
### Argument `-I  `
Short form for `--input`

Connects to the server and takes input from the terminal and forwards it to the server. It should be used with `-O` to create a fully functional console.
The program no must be terminated with `Ctrl`+`C`.

Example: `netherfox -n server -IO`

### Argument `-O  `
Short form for `--output`

Connects to the server and takes output from the server and forwards it to the terminal. It should be used with `-I` to create a fully functional console.
The program no must be terminated with `Ctrl`+`C`. 

Example: `netherfox -n server -IO`
### Argument `-i  [command]`
Short form for `--insert`

Connects to the server and immediately sends the specified command to the server and exits afterwards. This is useful for controlling the server via bash scripts.

Example: `netherfox -n server -i stop` 
### Argument `-c  `
Short form for `--colours`

Colourizes the output of the terminal.

Example: `netherfox -n server -cIO`