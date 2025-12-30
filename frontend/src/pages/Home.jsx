import React from 'react'
import MessageArea from "../components/MessageArea";
import SideBar from "../components/SideBar";

const Home = () => {
  return (
    <div className='flex w-full h-full '>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home
