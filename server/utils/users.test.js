const expect = require('expect');

const {Users} = require('./users');



describe('Users', ()=>{
  //seed data
  var users;
  beforeEach(()=>{
    users = new Users();
    users.users = [{
      id:'1',
      name:'Mike',
      room: 'The room'
    },{
      id:'2',
      name:'Ike',
      room: 'The room'
    },{
      id:'3',
      name:'Dike',
      room: 'Second room'
    }];

  })

  it('should add new user', ()=>{
    var users = new Users();
    var user = {
      id: '123',
      name: 'Djans',
      room: 'The room'
    }
    var resUser = users.addUser(user.id,user.name,user.room);

    expect(users.users).toEqual([user]);
  });

  it('should find user', ()=>{
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', ()=>{
    var userId = '22';
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should remove user',()=>{
    var userId = '1';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });
  it('should not remove the user',()=>{
    var userId = '22';
    var user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  })


  it('should return names for the room', ()=>{
    var userList = users.getUserList('The room');
    expect(userList).toEqual(['Mike','Ike']);
  });

  it('should return names for second room', ()=>{
    var userList = users.getUserList('Second room');
    expect(userList).toEqual(['Dike']);
  });

});
