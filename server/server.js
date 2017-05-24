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
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('new user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined.'))

  socket.on('createMessage', (message)=>{
    console.log('create message', message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    // socket.broadcast.emit('newMessage',{
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('disconnect', ()=>{
    console.log('user disconnected')
  });
});



server.listen(port, ()=>{
  console.log(`You are on port ${port}`);
});
