import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Upload from './pages/Upload.jsx'
import CheckAuth from './components/CheckAuth.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { Toaster } from 'react-hot-toast';
import AnalysisDetail from './pages/AnalysisDetail';
import ForgotPassword from './pages/ForgotPassword.jsx'


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CheckAuth protectedRoute={false}>
          <App/>
        </CheckAuth>}/>
        <Route path='/signup' element={<CheckAuth protectedRoute={false}>
          <Signup/>
        </CheckAuth>}/>
        <Route path='/login' element={<CheckAuth protectedRoute={false}>
          <Login/>
        </CheckAuth>}/>
        <Route path='/upload' element={<CheckAuth protectedRoute={true}>
          <Upload/>
        </CheckAuth>}/>
        <Route path='/dashboard' element={<CheckAuth protectedRoute={true}>
          <Dashboard/>
        </CheckAuth>}/>
        <Route path='/dashboard/:id' element={<CheckAuth protectedRoute={true}>
          <AnalysisDetail/>
        </CheckAuth>}/>
        <Route path='/forgot-password' element={<CheckAuth protectedRoute={false}>
          <ForgotPassword/>
        </CheckAuth>}/>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '1rem',
            padding: '0.5rem',
            fontWeight: "600"
          },
          success: {
            style: { background: '#e0f8ec', color: '#05603a' },
          },
          error: {
            style: { background: '#fdecea', color: '#7a271a' },
          },
        }}
      />
    </BrowserRouter>
)
