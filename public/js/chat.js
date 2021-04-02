const socket = io();
var input = document.querySelector("#input");
var send = document.querySelector("#send");
var chatList = document.querySelector(".chat-list");
const roomName = document.querySelector("#room-name");
const roomUsers = document.querySelector(".room-users-list");
const leave = document.querySelector("#leave");
//values from prompt
// => naam,room

//join a room
socket.emit("joinroom", { naam, room });
socket.on("roomusers", ({ room, users }) => {
    renderRoom(room);
    renderUsers(users);
});
//listening to "message" event
socket.on("message", (data) => {
    renderBotMessage(data);
});
//listening to "chat" event
socket.on("chat", (data) => {
    renderMessage(data);
});

//send message function
//on btn click
const sendMessage = () => {
    text = input.value;
    if (text.length > 0) {
        socket.emit("chat", text);
        input.value = "";
        input.focus();
    } else {
        alert("type a message to send");
    }
};

// or enter
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

//render "chat" message

const renderMessage = (data) => {
    var list = document.createElement("li");
    list.classList.add("chat-message");
    list.innerHTML = `
        <p class="chat-info">${data.username}<span>${data.time}</span></p>
        <p class="chat-text">${data.text}</p>
    `;
    chatList.appendChild(list);
    chatList.scrollTop = chatList.scrollHeight;
};
//
const renderBotMessage = (data) => {
    var list = document.createElement("li");
    list.classList.add("chat-message-bot");
    list.innerHTML = `
        <p class="chat-info">${data.username}<span>${data.time}</span></p>
        <p class="chat-text">${data.text}</p>
    `;
    chatList.appendChild(list);
    chatList.scrollTop = chatList.scrollHeight;
};

//leave room handler
leave.addEventListener("click", function () {
    location.reload();
});

const renderRoom = (room) => {
    roomName.innerHTML = room;
};
const renderUsers = (users) => {
    roomUsers.innerHTML = "";
    users.forEach((user) => {
        const item = document.createElement("li");
        item.classList.add("room-user");
        item.innerHTML = user.username;
        roomUsers.appendChild(item);
    });
};
