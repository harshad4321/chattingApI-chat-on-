const path = require('path');
const express = require('express');
const http = require("http");
const socketio = require('socket.io')
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter");
const redis = require("redis");
require("dotenv").config();

// const { createClient } = redis;
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");


const app = express()
const server = http.createServer(app);
const io = socketio(server);


var engines = require('consolidate');
var swig = require('swig')


app.engine('html', engines.swig);
app.set('views', __dirname + '/layout');
app.set('view engine', 'html');

const usersRoute = require('./routers/index.js')

app.use(express.static(path.join(__dirname + '/public')))


app.use('/', usersRoute)




const botName = "ChatOn Bot";

// (async () => {
//     pubClient = createClient({ url: "redis://redis:6379" });
//     await pubClient.connect();
//     subClient = pubClient.duplicate();
//     io.adapter(createAdapter(pubClient, subClient));
// })();

// Run when client connects
io.on("connection", (socket) => {
    // console.log(io.of("/").adapter);
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to ChatOn!"));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});



const PORT = process.env.PORT || 3000;
// server.listen(3000);
server.listen(PORT, () => {
    console.log(`server is connected to port ${(PORT)}.`);
})
