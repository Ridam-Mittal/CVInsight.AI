// src/components/Navbar.jsx
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';

export default function Footer() {

  return (
    <footer className="flex items-center justify-between px-7 py-4 border-b border-[#2a2b31] bg-[#c5c6c8]">
      <div
        className="flex items-center gap-3 cursor-pointer"
      >
        <span className="bg-gray-900 rounded-lg p-1.5">
            <FontAwesomeIcon icon={faFile} style={{ color: 'white', fontSize: '23px' }} />
        </span>
        <div className="flex flex-col ">
            <span className="text-xl font-bold text-gray-900">CVInsight AI</span>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <span className=" text-lg text-[#3d424f]">
           © 2025 AI Powered Resume Analysis App. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
