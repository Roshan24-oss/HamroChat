import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main.jsx'
import {useDispatch} from  'react-redux';
import {setUserData} from '../redux/userSlice.js'


const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  let [loading,setLoding]=useState(false);
  const[error,setError]=useState("");

  let dispatch=useDispatch()

 


  const handleSignUp = async (e) => {
    e.preventDefault()
setLoding(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      
      )
  dispatch(setUserData(result.data))
      console.log(result.data)
      navigate("/login")
      setUserName("")
      setEmail("")
      setPassword("")
      setLoding(false);
      setError("");
    } catch (error) {
      console.log("Error during sign up:", error)
      setLoding(false);
      setError(error?.response?.data?.message);
    }
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col gap-6 overflow-hidden">
        
        {/* Header */}
        <div className="w-full h-52 bg-gradient-to-br from-blue-400 to-cyan-400 flex flex-col items-center justify-center rounded-b-[50%]">
          <h1 className="text-white text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-yellow-300">HamroChat</span>
          </h1>

          <img
            src="/HamroCha.png"
            alt="HamroChat Logo"
            className="h-32 w-32 object-contain rounded shadow-xl"
          />
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 px-6 py-4"
          onSubmit={handleSignUp}
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full h-12 px-4 rounded-lg border-2 border-blue-300 focus:border-blue-500 outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 rounded-lg border-2 border-blue-300 focus:border-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 px-4 pr-12 rounded-lg border-2 border-blue-300 focus:border-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 font-semibold text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>


          {error&& <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-blue-500 rounded-lg text-white font-bold text-lg hover:bg-blue-600 transition-all" disabled={loading}
          >
            {loading?"Loading...":"Sign Up"}
          </button>

          <p className="text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
