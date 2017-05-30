const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');


const publicPath =  path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users}= require('./utils/users');
const users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('new user connected');


  socket.on('join', (params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required.');
    }


    //make rooms and join user into room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined.`))


    callback()
  })



  socket.on('createMessage', (message, callback)=>{
    console.log('create message', message);
    io.emit('newMessage', generateMessage(message.from,message.text));

    // socket.broadcast.emit('newMessage',{
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('disconnect', ()=>{
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.rooms));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });
});



server.listen(port, ()=>{
  console.log(`You are on port ${port}`);
});
