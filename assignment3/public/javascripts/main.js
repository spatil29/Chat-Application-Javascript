$(function() {
  var FADE_TIME = 150; 
  var TYPING_TIMER_LENGTH = 400;
 
  var $window = $(window);
  var $userName = $('.userName'); 
  var $messages = $('.messages'); 
  var $inputMsg = $('.inputMsg'); 

  var $loginPage = $('.loginPage'); 
  var $chatPage = $('.chat.page'); 
var $likeMsg=$('.likeMsg');
  
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $userName.focus();

  var socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participants";
    } else {
      message += "there are "+data.numUsers+"participants";
    }
    log(message);
	
  }

  
  function setUsername () {
    username = cleanInput($userName.val().trim());

  
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMsg.focus();
	
      socket.emit('addUser', username);
    }
	
  }

  function sendMessage () {
    var message = $inputMsg.val();
    if (message && connected) {
      $inputMsg.val('');
      addChatMessage({
        username: username,
        message: message
      });
	  

      socket.emit('newM', message);
	  
    }
	
  }
 
  function log (message, options) {

    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  
  function addChatMessage (data, options) {
	 // console.log("inside addChatMessage function");

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);
	  
    
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username).append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }
  
 
  function addMessageElement (el, options) {
    var $el = $(el);

  
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

 var COLORS = [
   '#D8F005', '#AEC200', '#F5D836', '#F72DE6',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  function getUsernameColor (username) {
   
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
   
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  
	
  $window.keydown(function (event) {
	 
 
    if (event.which === 13) {
      if (username) {
        sendMessage();
     
      } else {
        setUsername();
      }
    }
	
  });
	
$("#like").on('click',function()
	{
		//console.log("Shashank");
		sendLike();
	   
	}); 
		function sendLike() {
	//console.log("inside sendLike function");
	var likeMsg=$likeMsg.val();
   //console.log("Likemsg"+likeMsg);
   
	likeMsg=cleanInput(likeMsg);
       
	if (likeMsg && connected) {
		 //console.log("inside likeMsg if condition");
      likeSymb({
        username: username,
        likeMsg: likeMsg
      });
socket.emit('likeM', likeMsg);
	}
	else{
		
	}
	
  }
	  function likeSymb(data, options) {
  // console.log("inside LikeSymb function");
    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $("<img class='image' src='images/like.png' height='42' width='42'>");

    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
    
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  
	 
  }
	

  
  $loginPage.click(function () {
    $currentInput.focus();
  });

 
  $inputMsg.click(function () {
    $inputMsg.focus();
  });

 
  socket.on('login', function (data) {
    connected = true;
    
    var message = "Welcome to Teen Connect";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  
  socket.on('newM', function (data) {
    addChatMessage(data);
  });
  socket.on('likeM', function (data) {
    likeSymb(data);
  });

 
  socket.on('newUser', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
	var userList= data.username;
	//console.log(userList);
  });

  socket.on('userDiscon', function (data) {
    log(data.username + ' logged Out');
    addParticipantsMessage(data);
   
  });

});