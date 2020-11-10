const WebSocketServer = require("ws").Server


const server = new WebSocketServer({ port: 9090 })

var users = {};

//  ws://l72.16.200.192:9090



function sendTo(connection, message) {
    connection.send(JSON.stringify(message));
}

server.on("connection", (connection) => {


    console.log("User Connected")


    connection.on("message", (message) => {

        console.log("Got message" + message)

        var data;

        try {
            data = JSON.parse(message)
        } catch (e) {
            console.log("Invalid JSON");
            data = {};
        }


        switch (data.type) {

            case "login":
                console.log("User Logged In " + data.name)


                //if anyone with this username is logged in then reject 

                if (users[data.name]) {

                    sendTo(connection, {

                        type: "Login",
                        success: "false"
                    })

                } else {

                    //save user connection on the server
                    users[data.name] = connection
                    connection.name = data.name

                    sendTo(connection, {
                        type: "login",
                        success: true
                    })

                }
                break;


            case "offer":
                console.log("Sending Offer to ", data.name)

                var conn = users[data.name];

                if (conn != null) {

                    //connecting user A with B
                    connection.otherName = data.name

                    sendTo(conn, {

                        type: "offer",
                        offer: data.offer,
                        name: connection.name
                    })
                }

                break;

            case "answer":
                console.log("Sending Answer to " + data.name)

                //when user B answers UsER A
                var conn = users[data.name]

                if (conn != null) {

                    connection.otherName = data.name
                    sendTo(conn, {

                        type: "answer",
                        answer: data.answer
                    })
                }
                break;

            case "candidate":
                console.log("Sending candidate to:", data.name);
                var conn = users[data.name];

                if (conn != null) {
                    sendTo(conn, {
                        type: "candidate",
                        candidate: data.candidate
                    });
                }

                break;

            case "leave":
                console.log("Disconnecting from", data.name);
                var conn = users[data.name];
                conn.otherName = null;

                //notify the other user so he can disconnect his peer connection 
                if (conn != null) {
                    sendTo(conn, {
                        type: "leave"
                    });
                }

                break;


            default:
                sendTo(connection, {
                    type: "error",
                    message: "Command not found" + data.type
                })

                break;

        }


    })

    connection.on("close", function () {

        if (connection.name) {
            delete users[connection.name];

            if (connection.otherName) {
                console.log("Disconnecting from ", connection.otherName);
                var conn = users[connection.otherName];
                conn.otherName = null;

                if (conn != null) {
                    sendTo(conn, {
                        type: "leave"
                    });
                }
            }
        }
    });
    
    connection.send("Hello from Server")

})