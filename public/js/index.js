var socket = io();

socket.on('connect', function(){
  console.log('connected to the server')
});

socket.on('newMessage', function(message){
  console.log('new message recived:',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});


socket.on('disconnect', function(){
  console.log('disconected from server');
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('You dont have geolocation supported');
  }
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
  }, function(){
    alert('Unable to fetch location');
  })
})
