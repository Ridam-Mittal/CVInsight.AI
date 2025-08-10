import React from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBrain, faChartSimple, faCommentDots, faBolt, faShield, faClock } from '@fortawesome/free-solid-svg-icons';
import HowItWorks from "../components/How";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";



function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <>
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-30 px-4 max-w-6xl mx-auto ">
        <span className="inline-flex items-center bg-[#1a1c22] px-4 py-1 rounded-full text-white font-semibold text-md shadow border border-[#23242a]">
        <span className="mr-2 text-xl">🚀</span>
          AI-Powered Document Intelligence
        </span>
        <h1 className="text-7xl md:text-6xl font-bold mb-6 leading-tight text-gray-300 mt-6">
          Compare Resumes with JDs Using AI Precision 🎯
        </h1>
        <p className="max-w-4xl text-2xl text-gray-400 mb-10 mt-5 leading-relaxed">
          Upload your resume and job description to unlock insights. Get match scores, skill analysis, and smart suggestions to boost your job success with advanced AI.
        </p>
        <div className="flex gap-4 mb-12">
          <Link
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xl font-semibold shadow"
            to={user ? `/upload`: `/login`}
          >
            Upload Resume & JD →
          </Link>
          <Link
            className="px-6 py-3 bg-[#1a1c22] hover:bg-[#2a2b31] text-[#f4f5f7] border border-[#2a2b31] rounded-lg text-xl font-semibold"
            to={user ? `/dashboard`: `/login`}
          >
            Dashboard
          </Link>
        </div>
      </main>
      <div className="w-full px-4 pt-20 pb-14 bg-[#040404]">
        <div className="max-w-full mx-auto">
          <h2 className="text-5xl md:text-4xl font-bold text-white mb-4 text-center">
            Powerful Features for Job Matching and Resume Analysis
          </h2>
          <p className="text-[#b3b5bd] text-center mb-12 max-w-2xl mx-auto text-2xl">
            AI-enhanced tools designed to give you deep insights into your resume and job fit
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
              {/* Feature 1 */}
              <div className="bg-[#1b1b204c] group border-2 border-[#383942] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c]">
                  <FontAwesomeIcon icon={faBrain} style={{fontSize: '25px'}}/>
                </div>
                <h4 className="font-semibold text-xl text-white">AI-Powered Resume Analysis</h4>
                <p className="text-[#b3b5bd] text-md">Advanced language models analyze your resume and job description to understand role alignment with human-like insight.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#1b1b204c] group border-2 border-[#383942] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c]">
                  <FontAwesomeIcon icon={faChartSimple} style={{fontSize: '25px'}}/>
                </div>
                <h4 className="font-semibold text-xl text-white">Smart Match Scoring</h4>
                <p className="text-[#b3b5bd] text-md">Instantly see how well your resume matches any job using intelligent scoring and skill gap evaluation.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#1b1b204c] group border-2 border-[#383942] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c] ">
                  <FontAwesomeIcon icon={faCommentDots} style={{fontSize: '25px'}}/>
                </div>
                <h4 className="font-semibold text-xl  text-white">Personalized Improvement Suggestions</h4>
                <p className="text-[#b3b5bd] text-md">Receive actionable tips to optimize your resume for better job fit and higher chances of selection.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#1b1b204c] group border-2 border-[#383942] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c]">
                  <FontAwesomeIcon icon={faBolt} style={{fontSize: '25px'}}/>
                </div>
                <h4 className="font-semibold text-xl text-white">Fast & Effortless Matching</h4>
                <p className="text-[#b3b5bd] text-md">Upload and compare resumes in seconds—no manual formatting or tedious side-by-side comparisons.</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#1b1b204c] border-2 border-[#383942] group rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c]">
                  <FontAwesomeIcon icon={faShield} style={{fontSize: '25px'}} />
                </div>
                <h4 className="font-semibold text-xl text-white">Secure & Private History</h4>
                <p className="text-[#b3b5bd] text-md">Your docs never leave unless you choose. Privacy-first engineering.</p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#1b1b204c] group border-2 border-[#383942] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-5 hover:bg-[#4c4c514c] cursor-pointer">
                <div className="bg-[#23242a] p-2 rounded w-fit group-hover:bg-gray-100 group-hover:text-[#18181c] ">
                  <FontAwesomeIcon icon={faClock} style={{fontSize: '25px'}}/>
                </div>
                <h4 className="font-semibold text-xl text-white">Save Time, Apply Smarter</h4>
                <p className="text-[#b3b5bd] text-md">Cut hours of resume tailoring with instant analysis and recommendations tailored to each job.</p>
              </div>
          </div>
        </div>
      </div>
      <HowItWorks/>
    </>
  );
}

export default App;