var socket = io();

socket.on('connect', function(){
  console.log('connected to the server')


  socket.on('newMessage', function(message){
    console.log('new message recived:',message);
  })

  socket.emit('createMessage',{
    from: 'jessica',
    text: 'chastain'
  })
});

socket.on('disconnect', function(){
  console.log('disconected from server');
});
