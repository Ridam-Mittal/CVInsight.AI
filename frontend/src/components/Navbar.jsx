// src/components/Navbar.jsx
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await axios.get('http://localhost:8000/api/auth/logout', {
        withCredentials: true,
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      toast.success("Logged out");
      navigate('/login');
    } catch(err){
      console.error("Verification failed: ", err.response?.data || err.message);
    }
  }

  // console.log(user);
  return (
    <header className="flex items-center justify-between px-7 py-4 border-b border-[#2a2b31] bg-[#0e0f11]">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/') }
      >
        <span className="bg-gray-100 rounded-lg p-1.5">
            <FontAwesomeIcon icon={faFile} style={{ color: 'black', fontSize: '23px' }} />
        </span>
        <div className="flex flex-col ">
            <span className="text-xl font-bold">CVInsight AI</span>
            <span className=" text-sm text-[#888b97]">
                AI Powered Resume analysis
            </span>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
        { !user ? (
            <>
             <Link
            className="text-lg px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            to='/'
            >   
                Home
            </Link>
            <button
            className="text-md px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            onClick={() => navigate('/signup') }
            >
            Sign Up
            </button>
            <button
            className="text-md px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            onClick={() => navigate('/login') }
            >
            Log In
            </button>
            </>
        ): (
            <>
            <Link
            className="text-lg px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            to='/'
            >   
                Home
            </Link>
            <Link
            className="text-lg px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            to='/upload'
            >   
              Upload
            </Link>
            <Link
            className="text-2xl px-4 py-1 border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            to='/dashboard'
            >   
                <FontAwesomeIcon icon={faUser} style={{fontSize: '25px'}}/>
            </Link>
            <button
            className="text-lg px-4 py-1 bg-[#0e0f11] border-gray-600 border rounded cursor-pointer font-semibold hover:bg-[#dcdce1] hover:text-gray-900"
            onClick={handleLogout}
            >   
              Logout
            </button>
            </>
        )}
      </div>
      
    
    </header>
  );
}
