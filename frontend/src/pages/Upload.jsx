import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


function Upload() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [analysis, setAnalysis] = useState(null); // updated to store response
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (type === "resume") setResume(file);
      if (type === "jd") setJd(file);
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  

  const handleMatch = async () => {
    if (!resume || !jd) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jd", jd);

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analysis`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // 🔐 this is critical if your backend sets/reads cookies
      });

      setAnalysis(data.analysis); // save structured result to state
      toast.success("Analysis successful. Results will be emailed to you");
    } catch (error) {
      console.error("Analysis failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="flex flex-1 mb-20">
        {/* Sidebar */}
        <aside className="w-[30%] bg-[#0e0f10] p-6 flex flex-col gap-8">
          <div className="bg-[#1f1e1e63] p-5 rounded-lg border border-[#555558] space-y-4 flex flex-col gap-6 items-center">
            {/* Resume Upload */}
            <div className="flex flex-col gap-4 w-full">
              <div className="mb-1 text-lg font-semibold pl-2">Upload Resume (PDF):</div>
              <div className="relative bg-[#1f1e1e] p-4 rounded-lg hover:border-[#7c7c7c] border-2 border-dashed border-[#555558] cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-white space-x-2 gap-3">
                  <FontAwesomeIcon icon={faUpload} style={{ fontSize: "25px" }} />
                  <span className="flex flex-col items-center text-md">
                    {resume?.name || "Click to upload your Resume"}
                  </span>
                </div>
              </div>
            </div>

            {/* JD Upload */}
            <div className="flex flex-col gap-4 w-full">
              <div className="mb-1 text-lg font-semibold pl-2">Upload JD (PDF):</div>
              <div className="relative bg-[#1f1e1e] p-4 rounded-lg hover:border-[#7c7c7c] border-2 border-dashed border-[#555558] cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "jd")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-white space-x-2 gap-3">
                  <FontAwesomeIcon icon={faUpload} style={{ fontSize: "25px" }} />
                  <span className="flex flex-col items-center text-md">
                    {jd?.name || "Click to upload Job Description"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleMatch}
              className={`w-3/4 py-2 rounded-xl font-semibold ${
                resume && jd
                  ? "bg-gray-100 hover:bg-gray-200 text-black"
                  : "bg-gray-200 cursor-not-allowed text-black"
              }`}
              disabled={!resume || !jd || loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {/* Uploaded File Status */}
          <div className="bg-[#1f1e1e63] p-5 rounded-lg border border-[#555558] flex flex-col gap-4">
            <div className="mb-2 font-semibold text-xl pl-2">Uploaded Files</div>
            <ul className="text-lg text-[#b0b0b0] space-y-1 flex flex-col gap-2">
              <li>Resume: {resume ? resume.name : "Not uploaded"}</li>
              <li>Job Description: {jd ? jd.name : "Not uploaded"}</li>
            </ul>
          </div>
        </aside>

        {/* Result Panel */}
        <main className="w-[70%] flex flex-col items-center p-6">
          <div className="bg-[#1f1e1e63] w-full h-full border-[#555558] border rounded-lg flex flex-col items-center justify-center p-6">
            {!resume || !jd ? (
              <div className="text-center flex flex-col items-center gap-3">
                <FontAwesomeIcon icon={faMicrochip} style={{ fontSize: "80px" }} className="text-[#c6bebe2f] mb-10 font-light" />
                <div className="text-3xl font-bold mb-2">Upload Resume & JD PDFs</div>
                <p className="text-[#888b97] max-w-md text-lg">
                  Once both documents are uploaded, we’ll compare them using AI to show how well the resume fits the job description.
                </p>
              </div>
            ) : analysis ? (
              <div className="w-full max-w-full text-left space-y-6">
                <h2 className="text-3xl font-semibold mb-12 text-center">CV Analysis</h2>

                <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b]">
                  <h3 className="text-2xl font-semibold mb-2 text-[#90ee90]">✅ Overall Match: {analysis.matchScore}%</h3>
                  <p className="text-[#b0b0b0] text-lg">{analysis.summary}</p>
                </div>

                {analysis.missingSkills?.length > 0 && (
                  <div className="bg-[#2a2a2e] p-4 rounded-lg border border-[#79797b]">
                    <h3 className="text-2xl font-medium text-red-400">🚫 Missing or Weak Skills</h3>
                    <ul className="list-disc list-inside text-[#b0b0b0] mt-2 text-lg">
                      {analysis.missingSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-[#b0b0b0] whitespace-pre-line bg-[#2a2a2e] border border-[#79797b] rounded-lg p-4 text-lg">
                  <h3 className="text-2xl font-medium text-gray-50 mb-2">Suggested Improvements</h3>
                  {analysis?.suggestedImprovements || "No suggestions available."}
                </div>
                <h4 className="text-lg text-gray-300 text-center">
                  For a more detailed analysis...{" "}
                  <Link to={`/dashboard/${analysis._id}`} className="text-green-600 hover:underline font-medium">
                    Visit Dashboard
                  </Link>
                </h4>
              </div>
            ) : (
              <div className="text-center text-[#b0b0b0] text-lg">Click "Analyze" to see AI-powered results.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Upload;
