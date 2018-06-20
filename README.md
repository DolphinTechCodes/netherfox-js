# netherfox

# API
Netherfox can be required using `const netherfox = require("netherfox");`

## netherfox.start(name,command)
* `name` [String]: The name of the server and socket
* `command` [Array]: The start command to be executed

This function is used to start and enable further communication with a Minecraft server.

## netherfox.connect(name)
* `name` [String]: The name of the server and socket
* Returns: [Socket] Socket with extra methods

Establishes a connection to the Minecraft server for communication and returns a socket bound to the IPC server. The socket has assigned some extra methods.

## Methods and Events of the socket
The following paragraphs describe how to use the netherfox Socket

## Writing Input
TODO

# CLI