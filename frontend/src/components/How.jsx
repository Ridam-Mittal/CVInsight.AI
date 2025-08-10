import React from "react";
import { faUpload, faFilePdf, faMicrochip, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function HowItWorks() {
  const steps = [
    {
      title: "Upload Resume",
      description: "Drag & drop or choose your latest resume in PDF format.",
      icon: (
        <FontAwesomeIcon icon={faUpload} style={{fontSize: "32px"}}/>
      ),
    },
    {
      title: "Provide JD's",
      description: "Paste or upload one or more job descriptions you'd like to match.",
      icon: (
        <FontAwesomeIcon icon={faFilePdf} style={{fontSize: "32px"}}/>
      ),
    },
    {
      title: "AI Processing",
      description:
        "Our AI analyzes your resume against each JD in seconds—no manual work.",
      icon: (
        <FontAwesomeIcon icon={faMicrochip} style={{fontSize: "32px"}}/>
      ),
    },
    {
      title: "Get Job Fit Analysis",
      description:
        "See match scores and receive actionable AI-powered feedback instantly.",
      icon: (
        <FontAwesomeIcon icon={faChartSimple} style={{fontSize: "32px"}}/>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#0e0f11] py-25 px-4 pb-35">
      <div className="max-w-5xl mx-auto mb-10 flex flex-col items-center gap-5">
        <h2 className="text-5xl md:text-4xl font-bold text-white text-center mb-3">
          How It Works
        </h2>
        <p className="text-center text-[#b3b5bd] mb-10 text-2xl">
          Get started in four simple steps and unlock the power of AI for your job search.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-5">
              <div className="w-24 h-24 flex items-center justify-center bg-[#25262c] rounded-full shadow border border-[#23242a] hover:bg-gray-100 hover:text-[#25262c]">
                {step.icon}
              </div>
              <span className="text-2xl font-semibold text-white mb-1">
                {step.title}
              </span>
              <p className="text-[#b3b5bd] text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
