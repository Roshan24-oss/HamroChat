import React from 'react'
import { Navigate,Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import getOtherUsers from './customHooks/getOtherUsers.jsx'
import {useSelector} from 'react-redux'
import Profile from './pages/Profile.jsx'
import Home from "./pages/Home.jsx"

const App = () => {
  getCurrentUser()
  getOtherUsers()
  let {userData}=useSelector(state=>state.user)
  return (
    <Routes>
     <Route path='/login' element={!userData?<Login/>:<Navigate to='/'/>}/>
<Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
<Route path='/' element={userData?<Home/>:<Navigate to='/login'/> }/>



<Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>} />

<Route path="/home" element={<Home/>}/>

    </Routes>
  )
}

export default App
