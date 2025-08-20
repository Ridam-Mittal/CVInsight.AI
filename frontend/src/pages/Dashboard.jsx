import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveloading, setSaveloading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [Deleteloading, setDeleteLoading] = useState(false);


  const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analysis/history`, {
          withCredentials: true,
        });
        setHistory(data.history);
      } catch (err) {
        console.error('Fetching failed: ', err.response?.data || err.message);
        toast.error(err.response?.data?.error)
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveloading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/edit-info`,
        {
          fullname: fullname.trim(),
          email: email.trim(),
        },
        { withCredentials: true }
      );

      const newUser = data.user;
      user.fullname = newUser.fullname;
      user.email = newUser.email;
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Edit failed:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaveloading(false);
    }
  };


  const deleteAnalysis = async (id) => {
    setDeleteLoading(true);
    try{
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analysis/delete-analysis`, {
           analysisId: id 
        }, { withCredentials: true });

        toast.success("Deleted successfully");
        fetchHistory();
    }catch(error){
        console.error("Delete failed:", error);
        toast.error(error.response?.data?.error || "Failed to delete profile");
    }finally{
        setDeleteLoading(false);
    }
  }

  const scores = history.map(item => item.matchScore);
  const highMatches = scores.filter(score => score >= 75).length;
  const mediumMatches = scores.filter(score => score >= 50 && score < 75).length;
  const lowMatches = scores.filter(score => score < 50).length;

    const topScore = Math.max(...scores);
    const lowScore = Math.min(...scores);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    const totalResumes = history.length;

    const allMissingSkills = history.flatMap(item => item.missingSkills);
    const skillCount = allMissingSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});
    const mostCommonMissingSkill = Object.entries(skillCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    const companyCounts = history.reduce((acc, item) => {
      acc[item.company] = (acc[item.company] || 0) + 1;
      return acc;
    }, {});
    const mostTargetedCompany = Object.entries(companyCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <>
      <div className="flex min-h-[700px]">
        <aside className="w-[30%] bg-[#0e0f10] p-6 flex flex-col gap-6 border-[#555558] items-center">
          <h2 className='text-3xl font-bold mb-2'>User Profile</h2>
          <div className="flex flex-col items-center w-full p-5 rounded-lg border border-[#555558] bg-[#1f1e1e63]">
            <form
              autoComplete="off"
              className="flex flex-col items-end gap-5 w-[100%]"
              onSubmit={handleSave}
            >
              <h2 className="text-2xl font-semibold text-gray-100 w-full text-center">Update Info.</h2>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                autoComplete="off"
                className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1 transition-all duration-150"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1 transition-all duration-150"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-control flex flex-col items-center mt-2 w-3/5">
                <button
                  type="submit"
                  className="bg-gray-100 hover:bg-gray-200 text-black w-full py-2 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer"
                  disabled={loading}
                >
                  {saveloading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
           </div>
           <div className={`shadow-lg w-full space-y-4 text-lg mt-6 justify-center p-6 rounded-lg border border-[#555558] bg-[#1f1e1e63] ${loading ? 'items-center': ''} flex flex-col`}>
            {loading ? (
              <div className="w-8 h-8 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                <p>📂 <strong>Total Resumes Analyzed:</strong> {totalResumes}</p>
                <p>🏆 <strong>Top Match Score:</strong> {history.length ? topScore: 0}%</p>
                <p>📉 <strong>Lowest Match Score:</strong> {history.length ? lowScore: 0}%</p>
                <p>📊 <strong>Average Match Score:</strong> {history.length ? avgScore: 0}%</p>
                <p>🏢 <strong>Most Targeted Company:</strong> {history.length ? mostTargetedCompany: 'Not Applicable'}</p>
                <p>❌ <strong>Most Common / Latest Missing Skill:</strong> {history.length ? mostCommonMissingSkill:
                'Not Applicable'}</p>
                </>
            )}
        </div>

          {/* 📊 Chart + Match Score Summary Section */}
          <div className="flex flex-col items-center w-full justify-center p-6 rounded-lg border border-[#555558] bg-[#1f1e1e63]">
            <h2 className="text-xl font-semibold mb-4">📊 Match Score Overview</h2>
            {loading ? (
              <div className="w-8 h-8 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
            ) : ( 
                <>
                <div className="w-48 h-48 mb-4">
                <Doughnut
                data={{
                  labels: ['High (≥75%)', 'Medium (50–74%)', 'Low (<50%)'],
                  datasets: [{
                    data: [highMatches, mediumMatches, lowMatches],
                    backgroundColor: ['#10b981', '#fbbf24', '#ef4444'],
                  }],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: 'white',
                        font: { size: 12 }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-1 text-gray-300 text-lg w-full text-left">
              <p>✅ High Match Score: <strong>{highMatches}</strong></p>
              <p>🟡 Medium Match Score: <strong>{mediumMatches}</strong></p>
              <p>🔴 Low Match Score: <strong>{lowMatches}</strong></p>
            </div>
            </>
            )}
          </div>
        </aside>

        <main className="w-[70%] flex flex-col items-center p-6 bg-[#11101069] border-[#c6c6c9]">
          <div className="text-3xl font-bold mb-8">Analysis History</div>

          <div className={`bg-[#1f1e1e63] w-full h-auto border-[#555558] border rounded-lg flex flex-col items-center  p-6 ${loading ? 'justify-center' : 'justify-start'}`}>
            <input
              type="text"
              placeholder="Search by Company"
              className="mb-10 w-full p-3 px-4 rounded bg-[#2a2a2e] text-white border-1 border-[#fbfbff]focus:outline-n"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {loading ? (
  <div className="w-10 h-10 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
) : (
  (() => {
    const filteredHistory = history.filter((item) =>
      item.matchScore.toString().includes(searchTerm.toString()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredHistory.length === 0) {
      return (
        <div className="text-center text-gray-400 text-lg mt-4">
          📭 No analysis found. 
        </div>
      );
    }

    return filteredHistory.map((historyItem) => (
      <div
        key={historyItem._id}
        onClick={() => navigate(`/dashboard/${historyItem._id}`)}
        className="bg-[#2a2a2e] p-4 rounded-2xl  w-full mb-6 cursor-pointer hover:bg-[#3f3f71] transition-all duration-150 border border-[#7a7a7a] hover:shadow-indigo-500/20 flex flex-col hover:shadow-lg"
      >
        {/* Match Score and Date */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-green-400">
            Match Score: {historyItem.matchScore}%
          </h3>
          <button
            className="bg-gray-300 hover:bg-red-500 text-black w-1/9 py-1 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer"
            disabled={Deleteloading}
            onClick={(e) => {
              e.stopPropagation();
              deleteAnalysis(historyItem._id);
            }}
          >
            {Deleteloading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>

        {/* Job Info */}
        {(historyItem.jobTitle || historyItem.company) && (
          <div className="text-white text-lg mb-3">
            <span className="font-medium">{historyItem.jobTitle || "Role"}</span>
            {historyItem.company && (
              <span className="text-gray-400 ml-1">at {historyItem.company}</span>
            )}
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {historyItem.topMatchSkills?.slice(0, 3).map((skill, i) => (
            <span
              key={`top-skill-${i}`}
              className="bg-green-800 text-green-100 px-5 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

          {historyItem.missingSkills?.slice(0, 2).map((skill, i) => (
            <span
              key={`missing-skill-${i}`}
              className="bg-yellow-800 text-yellow-100 px-5 py-1 rounded-full text-sm"
            >
              Missing: {skill}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p
          className={`text-sm text-[#b0b0b0] mb-3 italic ${
            historyItem.summary.length > 150 ? "line-clamp-2" : ""
          }`}
        >
          {historyItem.summary}
        </p>
        <span className="text-sm text-gray-300 w-full text-right">
          {new Date(historyItem.createdAt).toLocaleString()}
        </span>
      </div>
    ));
  })()
)}

          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
