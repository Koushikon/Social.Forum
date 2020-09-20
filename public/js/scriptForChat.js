// Onload chat.ejs
$(document).ready(function () {
	$(document).delegate('.open', 'click', function (event) {
		$(this).addClass('oppenned');
		event.stopPropagation();
	});

	$(document).delegate('body', 'click', function (event) {
		$('.open').removeClass('oppenned');
	});

	$(document).delegate('.cls', 'click', function (event) {
		$('.open').removeClass('oppenned');
		event.stopPropagation();
	});
	$('#chatForm').hide();
	$('#emoji').hide();
	$('#send-location').hide();
});

$(function () {

  var socket = io('/chat');

  var username = $('#user').val();

  // 0 for full chats histroy is not loaded & 1 for full chats loaded
  var noChat = 0;
  // Counting total number of messages displayed
  var msgCount = 0;
  // It is 0 when old-chats-init is not executed and 1 if executed
  var oldInitDone = 0;
  // Variable for setting room
  var roomId, toUser;

  // Sending Welcome message to everyone and brocast message
  socket.on("message", message => {
    console.log(message);
  });

  // Passing data on connection
  socket.on('connect', function () {
    socket.emit('set-user-data', username);
  });
  // End connect event.

  // Receiving onlineStack
  socket.on('onlineStack', function (stack) {
    $('#list').empty();

    $('#list').append($('<li>').append($(`<button id="ubtn" class="chat_list active_chat">
      </button>`).text("Global")));

    var totalOnline = 0;
    for (var user in stack) {

      // Setting txt1, txt2 shows users stauts
      if (user == username) {
        var txt1 = $(`<button id="ubtn" class="chat_list active_chat" disabled></button>`).text(user).css({
          "display": "none"
        });
      } else {

        if (stack[user] == "Online") {
          var txt2 = $('<span class="status"></span>').text(stack[user]).css({
            "color": "#33691E",
            "font-weight": "bolder"
          });
          totalOnline++;
        } else {
          var txt2 = $('<span class="status"></span>').text(stack[user]).css({
            "color": "#2c3e50"
          });
        }
        var txt1 = $(`<button id="ubtn" class="chat_list active_chat"></button>`).text(user);

      }
      // Listin for all users
      $('#list').append($('<li>').append(txt1, txt2));
      $('#totalOnline').text(totalOnline);

    }

    $('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));
  });
  // End of receiving onlineStack event


  // On button click function
  $(document).on("click", "#ubtn", function () {

    // Empty messages
    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;

    // Assigning friends name to whom messages will send, anf for Global its value is Global
    toUser = $(this).text();

    // Showing and hiding relevant information
    $('#frndName').text(toUser);
    $('#initMsg').hide();
    $('#chatForm').show();
    $('#emoji').show();
	  $('#send-location').show();

    // Assign two names for room that helps to one-to-one and & Global messaging
    if (toUser == "Global") {
      var currentRoom = "Global-Global";
      var reverseRoom = "Global-Global";
    } else {
      var currentRoom = username + "-" + toUser;
      var reverseRoom = toUser + "-" + username;
    }

    // Event to set room and join
    socket.emit('set-room', {
      name1: currentRoom,
      name2: reverseRoom
    });

  });
  // End of on button click event

  // Event for setting roomId
  socket.on('set-room', function (room) {

    // Empty messages before
    $('#messages').empty();
    $('#typing').text("");

    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;

    // Assigning room id to roomId variable, In one-to-one & group chat
    roomId = room;
    console.log("RoomId: " + roomId);

    // To get chat history on button click or as room is set
    socket.emit('old-chats-init', {
      room: roomId,
      username: username,
      msgCount: msgCount
    });

  });
  // End of set-room event

  // Scrolling to load old-chats
  $('#scrl2').scroll(function () {

    if ($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1) {
      socket.emit('old-chats', {
        room: roomId,
        username: username,
        msgCount: msgCount
      });
    }

  });
  // End of scrolling event

  // Listening old-chats event
  socket.on('old-chats', function (data) {

    if (data.room == roomId) {

      // Set the value to implies that old-chats first event is done
      oldInitDone = 1;
      if (data.result.length != 0) {

        $('#noChat').hide();
        for (var i = 0; i < data.result.length; i++) {

          // Styling chat messages
          var chatDate = moment(data.result[i].createdOn).format("MMMM Do YYYY, hh:mm:ss a");

          var txt1 = $('<strong></strong>').text(data.result[i].msgFrom + ": ");
          var txt2 = $('<span class="time_date"></span>').text(chatDate);
          var txt3 = $('<span><span>').append(txt1, txt2);
          var txt4 = $(`<p class="msg"></p>`).text(data.result[i].msg);

          // Showing messages in chat box
          if (username == data.result[i].msgFrom) {
            $('#messages').prepend($('<div class="outgoing_msg sent_msg">').append(txt3, txt4));
          } else {
            $('#messages').prepend($('<div class="incoming_msg received_msg">').append(txt3, txt4));

          }
          msgCount++;

        }
        console.log(msgCount);
      } else {
        $('#noChat').show();

        // Displaying no more chats message
        noChat = 1;
        // To prevent unnecessary scroll event
      }

      // Setting scrollbar up and Load 15 chats
      if (msgCount <= 15) {
        $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
      }
    }
  });
  // End of listening old-chats event

  // Keyup handler
  $('#myMsg').keyup(function () {
    if ($('#myMsg').val()) {
      socket.emit('typing');
    } else {
      socket.emit('stop_typing');
    }
  });
  // End of keyup handler

  // Receiving typing message
  socket.on('typing', function (msg) {
    var setTime;
    // Clearing previous setTimeout function
    clearTimeout(setTime);

    // Showing typing message
    $('#typing').text(msg);

    // Showing typing message only for few seconds
    setTime = setTimeout(function () {
      $('#typing').text("");
    }, 3500);
  });
  // End of typing event

  // Sending messages
  $('form').submit(function (e) {
    socket.emit('chat-msg', {
      msg: $('#myMsg').val(),
      msgTo: toUser,
      date: Date.now()
    });
    e.preventDefault();
    $('#myMsg').val("");
    return false;
  });
  // End sending messages

  // Receiving messages
  socket.on('chat-msg', function (data) {

    // Styling messages in chat box
    var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");

    var txt1 = $('<strong></strong>').text(data.msgFrom + ": ");
    var txt2 = $('<span class="time_date"></span>').text(chatDate);
    var txt3 = $('<span><span>').append(txt1, txt2);
    var txt4 = $(`<p class="msg"></p>`).text(data.msg);

    // Showing messages in box
    if (username == data.msgFrom) {
      $('#messages').append($('<div class="outgoing_msg sent_msg">').append(txt3, txt4));
    } else {
      $('#messages').append($('<div class="incoming_msg received_msg">').append(txt3, txt4));
    }

    msgCount++;
    console.log(msgCount);
    $('#typing').text("");
    $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
  });
  // End of receiving messages

  // Disconnect event, Passing data on connection
  socket.on('disconnect', function () {

    // Show and hide relevant info
    $('#list').empty();
    $('#messages').empty();
    $('#typing').text("");
    $('#frndName').text("Disconnected..");
    $('#noChat').hide();
    $('#initMsg').show().text("...Please, Refresh Your Page...");
    $('#chatForm').hide();
    msgCount = 0;
    noChat = 0;
  });
});