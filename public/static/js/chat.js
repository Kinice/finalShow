;(function(){
  window.onload = function() {
    var socket = io()
    var i = 0
    var textarea = document.getElementById('chat')
    var body = document.getElementById('msg-body')
    var namespace = document.getElementById('username')
    var login = document.getElementById('login')
    var timeStamp = new Date().getTime()
    var username = ''

    login.addEventListener('keypress', function(e) {
      e.preventDefault()
      if(e.keyCode == 13) {
        if(namespace.value) {
          username = namespace.value
          document.body.removeChild(login)
          socket.emit('user connect', {
            username: username,
            stamp: timeStamp
          })
        }
      } else {
        if(namespace.value.length<=10) {
          namespace.value += e.key
        }
      }
    })

    textarea.addEventListener('keypress', function(e) {
      e.preventDefault()
      if(e.keyCode == 13) {
        var msg = textarea.value
        if(!msg) {
          return
        }
        var finalMsg = {
          username: username,
          msg: msg,
          stamp: timeStamp
        }
        socket.emit('socket message', finalMsg)
        textarea.value = ''
        body.appendChild(createMsgBox(finalMsg, true))
      } else {
        textarea.value += e.key
      }
    })

    socket.on('socket message', function(msg) {
        if(timeStamp != msg.stamp && msg.msg) {
          body.appendChild(createMsgBox(msg, false))
        }
        body.scrollTop = body.scrollHeight
    })

    socket.on('user connect', function(msg) {
        body.appendChild(createTip(msg.username + ' 进入聊天室'))
        body.scrollTop = body.scrollHeight
    })

    socket.on('user disconnect', function(msg) {
        console.log(msg)
        body.appendChild(createTip(msg.username + ' 离开了聊天室'))
        body.scrollTop = body.scrollHeight
    })
  }

  function createMsgBox(msg, isSelf) {
    var msgBox = document.createElement('div')
    var avatar = document.createElement('div')
    var msgCon = document.createElement('div')
    var name = document.createElement('div')

    avatar.innerText = '头像'
    avatar.className = 'avatar'

    msgCon.innerText = msg.msg
    msgCon.className = 'chat-msg'

    name.innerText = msg.username
    name.className = 'name'

    msgBox.appendChild(avatar)
    msgBox.appendChild(msgCon)
    msgBox.appendChild(name)
    msgBox.className = 'chat-msg-box'

    isSelf ? msgBox.className += ' self' : msgBox.className += ' others' 

    return msgBox
  }

  function createTip(msg) {
    var tip = document.createElement('div')

    tip.className = 'desc-tip'
    tip.innerText = msg

    return tip
  }
})()