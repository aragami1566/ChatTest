require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chat')

const app = require('express')();

const http = require('http').Server(app)

const userRoute = require('./routes/userRoute');
const User = require('./models/userModel');
const Chat = require('./models/chatModel');

app.use('/', userRoute);

const io = require('socket.io')(http);

var usp = io.of('/user-namespace');

usp.on('connection', async function(socket){
    console.log('User connected');

    var userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate(userId, { $set:{ is_online:'1' } }, { new: true })
    .then(updatedUser => {
        console.log(`User ${updatedUser.name} is online: ${updatedUser.is_online}`);
    })
    .catch(err => console.error('Error updating user status:', err));
    
    //broadcast online status
    socket.broadcast.emit('getOnlineUser', { userId: userId });

    socket.on('disconnect', async function(){
        console.log('User disconnected');

        var userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate(userId, { $set:{ is_online:'0' } }, { new: true })
        //broadcast online status
        socket.broadcast.emit('getOfflineUser', { userId: userId });
    });
    //chat implementation
    socket.on('newChat', function(data){
        socket.broadcast.emit('loadNewChat', data);
    });

    //load old chat
    socket.on('existsChat', async function(data){
        var chats = await Chat.find({ $or:[
            { sender_id: data.sender_id, receiver_id: data.receiver_id },
            { sender_id: data.receiver_id, receiver_id: data.sender_id },
        ]});

        socket.emit('loadChats', { chats: chats });
    });
});

http.listen(3000, function(){
    console.log('Server is running on port 3000')
});
