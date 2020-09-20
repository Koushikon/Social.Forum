$(function () {
  var socket = io('/signup');

  var uflag = eflag = 0;

  // Check for unique username
  $('#uname').keyup(function () {
    var uname = $('#uname').val();

    socket.emit('checkUname', uname);
    socket.on('checkUname', function (data) {
      if (data == 1) {
        uflag = 1;
        document.getElementById('unameText').innerHTML = '✔️ Be Continue.';
        document.getElementById("unameIcon").style.color = "#2ecc71";
      } else {
        uflag = 0;
        document.getElementById('unameText').innerHTML = '❌ Username Already Exists.';
        document.getElementById("unameIcon").style.color = "#c0392b";
      }
    });
  });

  //checking for email.
  $('#email').keyup(function () {
    var email = $('#email').val();

    socket.emit('checkEmail', email);
    socket.on('checkEmail', function (data) {
      if (data == 1) {
        eflag = 1;
        document.getElementById('mailText').innerHTML = '✔️ Be Continue.';
        document.getElementById("mailIcon").style.color = "#2ecc71";
      } else {
        eflag = 0;
        document.getElementById('mailText').innerHTML = '❌ Email Already Exists.';
        document.getElementById("mailIcon").style.color = "#c0392b";
      }
    });
  });

  $('form').submit(function () {
    if (uflag == 1 && eflag == 1) {
      return true;
    } else {
      if (uflag == 0 && eflag == 0) {
        document.getElementById('unameText').innerHTML = '❌ Please Change.';
        document.getElementById('mailText').innerHTML = '❌ Please Change.';
      } else if (uflag == 0) {
        document.getElementById('unameText').innerHTML = '❌ Please Change.';
      } else if(eflag == 0) {
        document.getElementById('mailText').innerHTML = '❌ Please Change.';
      }
      return false;
    }
  });
});