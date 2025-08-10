import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import AIProcess from '../utils/ai.js';
import { Analysis } from '../models/analysis.js';
import { User } from '../models/user.js';
import { inngest } from '../inngest/client.js';

// Simple keyword checks
function looksLikeResume(text) {
  const keywords = ['experience', 'education', 'skills', 'projects', 'certification'];
  const lowerText = text.toLowerCase('/\b\w+\b/g');
  return keywords.some(keyword => lowerText.includes(keyword));
}

function looksLikeJobDescription(text) {
  const keywords = ['responsibilities', 'requirements', 'qualifications', 'job description', 'position'];
  const lowerText = text.toLowerCase('/\b\w+\b/g');
  return keywords.some(keyword => lowerText.includes(keyword));
}


export const Analyze = async (req, res) => {
  try {
    const resumeFile = req.files.resume?.[0];
    const jdFile = req.files.jd?.[0];

    if (!req.files || !req.files.resume || !req.files.jd) {
      return res.status(400).json({ error: "Missing resume or JD file" });
    }

    const resumeBuffer = resumeFile.buffer;
    const jdBuffer = jdFile.buffer;

    const resumeText = (await pdfParse(resumeBuffer)).text;
    const jobDescription = (await pdfParse(jdBuffer)).text;

    
    const resumeValid = looksLikeResume(resumeText);
    const jdValid = looksLikeJobDescription(jobDescription);
    
    // console.log('resume valid', resumeValid);
    // console.log('jd valid', jdValid);
    

    // Check if they are swapped: resume buffer should look like resume, JD buffer like JD
    const swapped = looksLikeResume(jobDescription) && looksLikeJobDescription(resumeText);

    if (!resumeValid || !jdValid || swapped) {
      return res.status(400).json({ error: "Invalid or swapped files: please upload a valid resume and job description." });
    }

    const checkUnique = await Analysis.findOne({ resumeText, jobDescription, user: req.user._id });
    
    if(checkUnique){
      console.log('this worked');
      return res.status(200).json({
        message: 'Analysis',
        analysis: {
          _id: checkUnique._id,
          matchScore: checkUnique.matchScore,
          summary: checkUnique.summary,
          missingSkills: checkUnique.missingSkills,
          suggestedImprovements: checkUnique.suggestedImprovements,
          jobDescription: checkUnique.jobDescription,
          company: checkUnique.company,
          jobTitle: checkUnique.jobTitle,
          topMatchSkills: checkUnique.topMatchSkills,
          jobDescriptionSummary: checkUnique.jobDescriptionSummary,
          courseLinks: checkUnique.courseLinks,
          preparationTips: checkUnique.preparationTips,
          createdAt: checkUnique.createdAt
        }
      })
    }

    const result = await AIProcess({ resumeText, jobDescription });
    if (!result) {
      return res.status(400).json({ error: "AI analysis failed" });
    }

    // console.log("Raw AI Result:", result);


    const analysis = new Analysis({
      user: req.user._id,
      resumeText,
      jobDescription,
      matchScore: result.matchScore,
      summary: result.summary,
      missingSkills: result.missingSkills,
      suggestedImprovements: result.suggestedImprovements,
      company: result.company || '',
      jobTitle: result.jobTitle || '',
      topMatchSkills: result.topMatchSkills || [],
      jobDescriptionSummary: result.jobSummary || '',
      courseLinks: result.courseLinks || [],
      preparationTips: result.preparationTips || '',
    });


    const savedAnalysis = await analysis.save();

    const user = await User.findById(req.user._id);

    await inngest.send({
      name: "mail/request",
      data: {
        userId: user._id.toString(),
        email: user.email,
        analysisId: savedAnalysis._id
      },
    });

    
    res.status(200).json({
      message: "Analyzed successfully",
      analysis: {
        _id: savedAnalysis._id,
        matchScore: savedAnalysis.matchScore,
        summary: savedAnalysis.summary,
        missingSkills: savedAnalysis.missingSkills,
        suggestedImprovements: savedAnalysis.suggestedImprovements,
        jobDescription: savedAnalysis.jobDescription,
        company: savedAnalysis.company,
        jobTitle: savedAnalysis.jobTitle,
        topMatchSkills: savedAnalysis.topMatchSkills,
        jobDescriptionSummary: savedAnalysis.jobDescriptionSummary,
        courseLinks: savedAnalysis.courseLinks,
        preparationTips: savedAnalysis.preparationTips,
        createdAt: savedAnalysis.createdAt
      }
    });
  } catch (error) {
    console.error("Error in Analyze:");
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};






export const getHistory = async (req, res) => {
  try{
    const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetched successfully",
      history
    });
  } catch(error){
    console.error("Error in History:");
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}



export const getSingleHistory = async (req, res) => {
  try{
    const { historyId } = req.body;
    if(!historyId){
      return res.status(400).json({ error: "History ID isn't provided" });
    }

    const history = await Analysis.findById(historyId);


    // console.log(history);

    res.status(200).json({
      message: "Fetched successfully",
      history
    });
  }catch(error){
    console.error("Error in single History:");
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}



export const deleteAnalysis = async(req, res) => {
  try{
    const { analysisId } = req.body;
    if(!analysisId){
      return res.status(400).json({ error: "Analysis Id isn't provided" });
    }

    await Analysis.deleteOne({ _id: analysisId });


    return res.status(200).json({
      message: "deleted successfully",
    })
  }catch(error){
    console.error("Error in delete analysis:");
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}