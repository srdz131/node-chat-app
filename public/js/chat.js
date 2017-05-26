var socket = io();

function scrollToBottom(){
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //heights
  //var containerHeight = jQuery('.flex-container');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollHeight + newMessageHeight + lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function(){
  console.log('connected to the server')
});

socket.on('newMessage', function(message){
  var formatedTime = moment(message.createdAt).format('kk:mm');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formatedTime
  });

  jQuery('#messages').append(html)
  scrollToBottom();
  // console.log('new message recived:',message);
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formatedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
});


socket.on('disconnect', function(){
  console.log('disconected from server');
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){

  });
  jQuery('[name=message]').val('')
});
