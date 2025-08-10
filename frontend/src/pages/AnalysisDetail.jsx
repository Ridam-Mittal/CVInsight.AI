import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

function AnalysisDetail() {
    const location = useLocation();
    const id = location.pathname.split('/')[2];
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState({});

    useLayoutEffect(() => {
      const fetchdetail = async () => {
        try{
          const {data} = await axios.post(`https://resolve-ai-ug21.onrender.com/api/analysis/single-history`, {
            historyId: id.trim()
          }, {
            withCredentials: true
          })

          setAnalysis(data.history);
          console.log(data.history);
        }catch(err){
          console.error('Fetching failed: ', err.response?.data || err.message);
          toast.error(err.response?.data?.error)
        }finally{
          setLoading(false);
        }
      }

      fetchdetail();
    }, [id, location])

  return (
  <div className="min-h-screen bg-[#0e0f10] p-8 text-white">
    {loading ? (
      <div className="flex justify-center items-center h-[500px]">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    ) : (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: JD and JD Summary (stacked) */}
        <div className="w-[40%] flex flex-col gap-6">
          
          {/* Job Description Box */}
          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#444] custom-scrollbar max-h-[480px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">📄 Job Description</h2>
            <div className="whitespace-pre-wrap leading-relaxed text-gray-300 text-md break-words">
              {analysis.jobDescription?.trim().length > 0
                ? analysis.jobDescription.trim()
                : "⚠️ No job description available or could not be extracted."}
            </div>
          </div>

          {/* JD Summary Box */}
          {analysis.jobDescriptionSummary && (
            <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b]">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">📝 JD Summary</h3>
              <p className="text-[#b0b0b0] text-lg">{analysis.jobDescriptionSummary}</p>
            </div>
          )}
        </div>

        
        {/* RIGHT: Match Details */}
        <div className="w-[60%] border border-[#555558] bg-[#1f1e1e63] p-10 rounded-lg">

          <div className="w-full max-w-full text-left space-y-5 flex flex-col items-start">
            <h2 className="text-3xl font-semibold mb-8 text-white w-full text-center">📋 Match Analysis</h2>
            {/* Job Title & Company */}
            {(analysis.jobTitle || analysis.company) && (
              <div className="text-xl text-white text-center">
                <strong>{analysis.jobTitle || "Job Role"}</strong>
                {analysis.company && <span className="text-gray-400"> at {analysis.company}</span>}
              </div>
            )}

            {/* Match Score & Doughnut */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-28 h-28">
                <Doughnut
                  data={{
                    labels: ['Match Score', 'Remaining'],
                    datasets: [
                      {
                        data: [analysis.matchScore, 100 - analysis.matchScore],
                        backgroundColor: ['#10b981', '#1f2937'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    cutout: '70%',
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                  }}
                />
              </div>
              <h3 className="text-2xl text-green-400 font-bold">
                {analysis.matchScore}% Match
              </h3>
            </div>

    {/* Summary */}
    <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
      <h3 className="text-xl font-semibold mb-2 text-[#90ee90]">🔍 Summary</h3>
      <p className="text-[#b0b0b0] text-lg">{analysis.summary}</p>
    </div>

    {/* Top Match Skills */}
    {analysis.topMatchSkills?.length > 0 && (
      <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
        <h3 className="text-xl font-semibold mb-4 text-green-400">✅ Top Skills</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.topMatchSkills.map((skill, i) => (
            <span key={i} className="bg-green-800 text-green-100 px-4 py-1 rounded-full text-sm hover:bg-green-700 cursor-pointer">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Missing Skills */}
    {analysis.missingSkills?.length > 0 && (
      <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
        <h3 className="text-xl font-semibold text-red-400 mb-4">🚫 Missing or Weak Skills</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.missingSkills.map((skill, i) => (
            <span
              key={i}
              className="bg-red-800 text-red-100 px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-red-700 transition"
              title="Skill missing in resume"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Suggested Improvements */}
    <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
      <h3 className="text-xl font-semibold text-blue-400 mb-2">💡 Suggested Improvements</h3>
      <p className="text-[#b0b0b0] text-lg whitespace-pre-line">
        {analysis.suggestedImprovements || "No suggestions available."}
      </p>
    </div>

    {/* Preparation Tips */}
    {analysis.preparationTips && (
      <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
        <h3 className="text-xl font-semibold text-yellow-300 mb-2">📚 Preparation Tips</h3>
        <p className="text-[#b0b0b0] text-lg whitespace-pre-line">{analysis.preparationTips}</p>
      </div>
    )}

    {/* Course Links */}
    {analysis.courseLinks?.length > 0 && (
      <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b] w-full">
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">🔗 Suggested Courses</h3>
        <ul className="list-disc list-inside text-[#b0b0b0] text-lg">
          {analysis.courseLinks.map((course, i) => (
            <li key={i}>
              <span className="font-medium">{course.courseTopic}:</span>{" "}
              <a
                href={course.courseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {course.courseLink}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
        </div>
      </div>
    )}
  </div>
);

}

export default AnalysisDetail