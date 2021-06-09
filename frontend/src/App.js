import React, { useState, useEffect } from 'react'
import './App.css';
import Chat from './Chat';
import Sidebar from './SideBar'
import axios from './axios'
import Pusher from 'pusher-js'

function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get('/messages/sync')
    .then(response => {
      setMessages(response.data)
    })
  }, [])

  useEffect(() => {
    var pusher = new Pusher('13e641de4d5e88910322', {
      cluster: 'ap2'
    })

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    })
    
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])

  console.log(messages)

  return (
    <div className="app">
      <div className='app__body'>
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
