const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const _ = require("lodash");
const eventEmitter = new events.EventEmitter();

// Add DB Schemas
require("../app/models/user.js");
require("../app/models/chat.js");
require("../app/models/room.js");

// Use mongoose Schema models
const userModel = mongoose.model("User");
const chatModel = mongoose.model("Chat");
const roomModel = mongoose.model("Room");

module.exports.sockets = function (http) {
  io = socketio.listen(http);

  // Setting chat route
  const ioChat = io.of("/chat");

  const userStack = {};
  let oldChats, sendUserStack, setRoom;
  const userSocket = {};

  // Socket.io starts here
  ioChat.on("connection", function (socket) {

    // Function to get user name
    socket.on("set-user-data", function (username) {
      console.log(username + "  Connect for Messaging");

      socket.username = username;
      userSocket[socket.username] = socket.id;

      // Getting all users list
      eventEmitter.emit("get-all-users");

      // Feguring out whoose on or off
      sendUserStack = function () {
        for (i in userSocket) {
          for (j in userStack) {
            if (j == i) {
              userStack[j] = "Online";
            }
          }
        }

        // Show connection status message
        ioChat.emit("onlineStack", userStack);
      };
      // End sendUserStack function
    });
    // End set-user-data event

    //setting room
    socket.on("set-room", function (room) {

      // Leaving room.
      socket.leave(socket.room);

      //getting room data.
      eventEmitter.emit("get-room-data", room);

      //setting room and join
      setRoom = function (roomId) {
        socket.room = roomId;
        console.log("roomId : " + socket.room);
        socket.join(socket.room);
        ioChat.to(userSocket[socket.username]).emit("set-room", socket.room);
      };
    });
    // End of set-room event

    // Emits event to read old-chats-init from database
    socket.on("old-chats-init", function (data) {
      eventEmitter.emit("read-chat", data);
    });

    // Emits event to read old chats from database
    socket.on("old-chats", function (data) {
      eventEmitter.emit("read-chat", data);
    });

    // Sending old chats to client
    oldChats = function (result, username, room) {
      ioChat.to(userSocket[username]).emit("old-chats", {
        result: result,
        room: room
      });
    };

    // Show message on Typing
    socket.on("typing", function () {
      socket
        .to(socket.room)
        .broadcast.emit("typing", " typing...");
    });

    // Show message on Stop-Typing
    socket.on("stop_typing", function () {
      socket
        .to(socket.room)
        .broadcast.emit("typing", " stopped typing...");
    });

    // For showing chats
    socket.on("chat-msg", function (data) {

      // Emits event to save chat to database
      eventEmitter.emit("save-chat", {
        msgFrom: socket.username,
        msgTo: data.msgTo,
        msg: data.msg,
        room: socket.room,
        date: data.date
      });

      // Emits event to send chat msg to all clients
      ioChat.to(socket.room).emit("chat-msg", {
        msgFrom: socket.username,
        msg: data.msg,
        date: data.date
      });
    });

    // For showing Disconnect message
    socket.on("disconnect", function () {
      console.log("\t The " + socket.username + " - Disconnect for Messaging...");

      socket.broadcast.emit("broadcast", {
        description: socket.username + " has left"
      });

      _.unset(userSocket, socket.username);
      userStack[socket.username] = "Offline";

      ioChat.emit("onlineStack", userStack);
    });
    // End Disconnect event
  });

  // End of Socket.io codes
  // 
  // 
  // Save chats to the Database

  eventEmitter.on("save-chat", function (data) {

    var newChat = new chatModel({
      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msg: data.msg,
      room: data.room,
      createdOn: data.date
    });

    newChat.save(function (err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved");
      } else {
        console.log("Chat Saved");
      }
    });
  });
  // End of saving chat

  // Reading chat from database
  eventEmitter.on("read-chat", function (data) {
    chatModel
      .find({})
      .where("room")
      .equals(data.room)
      .sort("-createdOn")
      .skip(data.msgCount)
      .lean()
      .limit(15)
      .exec(function (err, result) {
        if (err) {
          console.log("Read Chat Error : " + err);
        } else {

          // Calling function which emits to client to show chats
          oldChats(result, data.username, data.room);
        }
      });
  });
  // End Reading chat from database

  // Listen to get all users & create list of users
  eventEmitter.on("get-all-users", function () {
    userModel
      .find({})
      .select("username")
      .exec(function (err, result) {
        if (err) {
          console.log("To get all usersError : " + err);
        } else {

          for (var i = 0; i < result.length; i++) {
            userStack[result[i].username] = "Offline";
          }
          sendUserStack();
        }
      });
  });
  // End of get-all-users

  // Listening Get room data
  eventEmitter.on("get-room-data", function (room) {
    roomModel.find({
      $or: [{
        name1: room.name1
      },

      {
        name1: room.name2
      },

      {
        name2: room.name1
      },

      {
        name2: room.name2
      }
      ]
    }, function (err, result) {

      if (err) {
        console.log("Get room data Error : " + err);
      } else {
        if (result == "" || result == undefined || result == null) {

          var today = Date.now();
          newRoom = new roomModel({
            name1: room.name1,
            name2: room.name2,
            lastActive: today,
            createdOn: today
          });
          // Room save info
          newRoom.save(function (err, newResult) {
            if (err) {
              console.log("Error : " + err);
            } else if (newResult == "" || newResult == undefined || newResult == null) {

              console.log("Some Error Occured During Room Creation");
            } else {
              // Calling setRoom function
              setRoom(newResult._id);
            }
          });
          // End saving room part
        } else {
          var jresult = JSON.parse(JSON.stringify(result));
          setRoom(jresult[0]._id);
          // Calling setRoom function
        }
        // End of result if
      }
    }
      //end of find room
    );
    // End of get-room-data listener
  });

  // End database operations for messaging
  // ..
  // ..
  // ..
  // Start Validation for signup

  // Setting Signup route
  const ioSignup = io.of("/signup");

  let checkUname, checkEmail;

  ioSignup.on("connection", function (socket) {
    console.log("Signup connected... for user");

    // Verifying unique username
    socket.on("checkUname", function (uname) {

      // To perform database operation
      eventEmitter.emit("findUsername", uname);
    });

    // Emit event for checkUserName
    checkUname = function (data) {
      ioSignup.to(socket.id).emit("checkUname", data);
    };
    // End checkUsername

    // Verifying unique Email
    socket.on("checkEmail", function (email) {

      // To perform database operation
      eventEmitter.emit("findEmail", email);
    });

    // Emit event for checkEmailId
    checkEmail = function (data) {
      ioSignup.to(socket.id).emit("checkEmail", data);
    };
    // End of checkEmail function

    // For disconnect
    socket.on("disconnect", function () {
      console.log("\tSignup Disconnected... for user");
    });
  });
  // End of io.Signup connection event

  // To find unique username
  eventEmitter.on("findUsername", function (uname) {
    userModel.find({
      username: uname
    },
      function (err, result) {
        if (err) {
          console.log("Error during check UserName : " + err);
        } else {

          if (result == "") {
            checkUname(1);
          } else {
            checkUname(0);
          }
        }
      }
    );
  });

  // To find unique email_id
  eventEmitter.on("findEmail", function (email) {
    userModel.find({
      email: email
    },
      function (err, result) {
        if (err) {
          console.log("Error during check EmailId : " + err);
        } else {

          if (result == "") {
            checkEmail(1);
          } else {
            checkEmail(0);
          }
        }
      }
    );
  });

  // End of Signup Socket.io connection
  // ..
  // ..
  // ..
  // Start for Rooms connection

  const Filter = require('bad-words');
  const { addUser, removeUser, getUser, getUsersInRoom, generateMessage, generateLocationMessage } = require('../middlewares/user-msg');

  // Setting rooms route
  const ioRoom = io.of("/rooms");

  ioRoom.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // User joining event listen
    socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options });

      if (error) {
        return callback(error);
      }
      socket.join(user.room);

      // Send welcome and joined message to everyone on that specific room
      socket.emit('message', generateMessage('Admin', 'Welcome!'));
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has Joined!`));
      ioRoom.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

      callback();
    });

    // Sending Message
    socket.on('sendMessaging', (message, callback) => {
      const user = getUser(socket.id);

      const filter = new Filter();
      if (filter.isProfane(message)) {
        return callback('Profanity is not allowed!');
      }

      ioRoom.to(user.room).emit('message', generateMessage(user.username, message));
      callback();
    });

    // Sending Location
    socket.on("sendLocation", (coords, callback) => {
      const user = getUser(socket.id);
      ioRoom.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
      callback();
    });

    // Sending the disconnect message to everyone
    socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if (user) {
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the Room`));
        ioRoom.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
        });
      }
    });

  });

  return io;
};