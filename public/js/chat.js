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
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('no error');
    }
  });
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

socket.on('updateUserList',function(users){
  var ul = jQuery('<ul></ul>');

  users.forEach(function(user){
    ul.append(jQuery('<li></li>').text(user));
  })

   jQuery('#userList').html(ul);
})


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){

  });
  jQuery('[name=message]').val('')
});
