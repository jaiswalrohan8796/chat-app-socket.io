const http = require("http");
const path = require("path");
const ejs = require("ejs");
const express = require("express");

//imports
const formatMessage = require("./utils/message.js");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users.js");

//config
const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views,views");

//socket.io
const io = require("socket.io")(httpServer);

//new user connection
io.on("connection", (socket) => {
    //listening to join room
    socket.on("joinroom", ({ naam, room }) => {
        //user
        const user = userJoin(socket.id, naam, room);

        //join socket
        socket.join(user.room);

        //emit message to connected client
        socket.emit(
            "message",
            formatMessage(
                "Bot",
                `${user.username} welcome to ${user.room} chat room`
            )
        );

        //broadcast to all client but user => user joined
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage("Bot", `${user.username} has joined`)
            );
        io.to(user.room).emit("roomusers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    //listening for "chat" event
    socket.on("chat", (data) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("chat", formatMessage(user.username, data));
    });

    //broadcast to all client but user => user left
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage("Bot", `${user.username} has left`)
            );
            io.to(user.room).emit("roomusers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

//routes
app.get("/", (req, res, next) => {
    res.render("index");
});

//listen
httpServer.listen(PORT, () => {
    console.log("listening on 3000");
});
