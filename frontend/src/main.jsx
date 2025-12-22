import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
export const serverUrl= "http://localhost:8000"

createRoot(document.getElementById('root')).render(
  <BrowserRouter> <App /></BrowserRouter>
   
  
)
