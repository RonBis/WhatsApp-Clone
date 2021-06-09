import React from 'react'
import './SideBar.css'
import { 
  Chat, 
  MoreVert, 
  DonutLarge, 
  SearchOutlined 
} from '@material-ui/icons';
import { Avatar, IconButton } from '@material-ui/core';
import SidebarChat from './SidebarChat'

function SideBar() {
  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar
          src='https://avatars.githubusercontent.com/u/66785801?s=60&v=4' 
        />
        <div className='sidebar__headerRight'>
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutlined />
          <input 
            placeholder='Search or start new chat' 
            type='text'
          />
        </div>
      </div>
      <div className='sidebar__chats'>
        <SidebarChat />
        <SidebarChat />
        <SidebarChat />
      </div>
    </div>
  )
}

export default SideBar
