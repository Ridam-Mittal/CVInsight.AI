 import { createAgent } from '@inngest/agent-kit';
 import { gemini } from '@inngest/agent-kit';

const AIProcess = async ({ resumeText, jobDescription }) => {
  const resumeMatchAgent = createAgent({
    model: gemini({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY
    }),
    name: "Resume Analyzer AI Assistant",
    system: `You are an intelligent AI assistant that evaluates how well a resume matches a job description.

            Your responsibilities:
            1. Provide a robust matchScore between 0–100. The score should reflect how well the resume aligns with the job description in terms of **skills**, **experience**, and **qualifications**.
                    - The more aligned skills the resume has with the job description, the higher the score.
                    - Penalize resumes that lack key or required skills.
            2. Provide a clear and detailed summary highlighting the strengths of the resume relative to the job description.
            3. List skills that are most strongly aligned between the resume and job description as an array called topMatchSkills.
            4. List skills that are required or preferred in the job description but are missing in the resume as an array called missingSkills.
            5. Provide the name of the company (if identifiable from the job description otherwise null) as company.
            6. Suggest detailed specific improvements to help the resume better match the job as suggestedImprovements.
            7. List the title of the position being applied for as jobTitle ((if identifiable from the job description otherwise null) as jobTitle
            8. Provide a concise summary of the job description's core purpose or focus as jobSummary.
            9. courseLinks: Array of two to three objects with two keys 
                {   courseTopic: string  (the missing skill), 
                    courseLink: string (a real, credible course URL from known platforms like Coursera, Udemy, edX, etc.) 
                } with real course URLs for missing skills
            10. Provide preparationTips: a paragraph of personalized advice to help the candidate prepare for such roles.
            

            IMPORTANT:
            - Respond ONLY in raw, valid JSON format.
            - Do NOT include markdown, code fences, comments, extra text, or any other formatting.
            - All keys are included, even if some values are null or [].
            - All links are real and relevant.
            - The JSON must strictly match this format:

            Example:
            {
                "matchScore": 86,
                "summary": "The resume aligns well with the frontend role due to React experience and relevant projects.",
                "missingSkills": ["CI/CD", "Unit Testing"],
                "suggestedImprovements": "Consider adding examples of recent work involving automated testing and build pipelines to better align with industry expectations.",
                 "company": "TechCorp",
                "jobTitle": "Backend Engineer",
                 "topMatchSkills": ["Node.js", "Express", "MongoDB"],
                 "jobSummary": "Hiring for a backend engineer to build scalable APIs using Node.js.",
                 "courseLinks": [
                   { "courseTopic": "CI/CD", "courseLink": "https://www.coursera.org/learn/devops-continuous-integration" },
                   { "courseTopic": "Unit Testing", "courseLink": "https://www.udemy.com/course/unit-testing-nodejs-jest/" }
                ],
                 "preparationTips": "Focus on hands-on projects involving CI/CD and automated testing. Build a backend API with integration pipelines and cover it with unit tests to demonstrate readiness."
            }`
        })

      
    const response = await resumeMatchAgent.run(`
        You are a resume analysis agent. Only return a strict JSON object with no extra text, headers, or markdown.

        Analyze the following resume and job description, and  provide a JSON object with:

        - matchScore: A number between 0–100.
        - summary: A clear summary of the strengths of the resume.
        - missingSkills: An array of relevant skills missing in resume but required for the job.
        - suggestedImprovements: Tips to improve the resume for this job.
        - company: String with company name if identifiable
        - jobTitle: String with the position title
        - topMatchSkills: Array of strings with skills strongly matching between resume and job description.
        - jobSummary: String summarizing the job description's core focus
        - courseLinks: Array of objects with two keys 
                {   courseTopic: string  (the missing skill), 
                    courseLink: string (a real, credible course or study material URL from known sources like google, youtube etc).
                } with real course URLs for missing skills
        - preparationTips: String with personalized advice to prepare for the role

        Respond ONLY in this JSON format:

        Example:
        {
            "matchScore": 86,
            "summary": "The resume aligns well with the frontend role due to React experience and relevant projects.",
            "missingSkills": ["CI/CD", "Unit Testing"],
            "suggestedImprovements": "Consider adding examples of recent work involving automated testing and build pipelines to better align with industry expectations.",
            "company": "TechCorp",
            "jobTitle": "Backend Engineer",
            "topMatchSkills": ["Node.js", "Express", "MongoDB"],
            "jobSummary": "Hiring for a backend engineer to build scalable APIs using Node.js.",
            "courseLinks": [
                { "courseTopic": "CI/CD", "courseLink": "https://www.coursera.org/learn/devops-continuous-integration" },
                { "courseTopic": "Unit Testing", "courseLink": "https://www.udemy.com/course/unit-testing-nodejs-jest/" }
            ],
            "preparationTips": "Focus on hands-on projects involving CI/CD and automated testing. Build a backend API with integration pipelines and cover it with unit tests to demonstrate readiness."
        }


        Important: Only suggest missing skills, improvements, and course topics that are directly implied or explicitly mentioned in the job description. Do not use generic filler skills unless they are clearly relevant to the job posting.

        Avoid copying from the example above. Treat it only as a format — not as content.

        Ensure:
        You must follow this JSON structure **exactly**, using all the same keys — even if some values are null or [].  
        - Do not add, remove, or rename keys.  
        - Do not include markdown, code blocks, extra text, or explanations.  
        - All values must be valid.  
        - Links must be real and from known platforms like google, youtube, etc, and not necessarily for every missing skills, only for those that actually require a tutorial.

        ---

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
    `)

    const raw = response.output?.[0]?.content;

    if (!raw) {
        console.error("Empty or missing AI output:", response);
        return null;
    }

    try {
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        // ✅ Manual key validation
        const requiredKeys = [
            "matchScore",
            "summary",
            "missingSkills",
            "suggestedImprovements",
            "company",
            "jobTitle",
            "topMatchSkills",
            "jobSummary",
            "courseLinks",
            "preparationTips"
        ];

        for (const key of requiredKeys) {
            if (!(key in parsed)) {
            throw new Error(`Missing key in AI output: ${key}`);
            }
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse valid JSON from Gemini:", e.message);
        console.error("Raw Gemini output:", raw); // (optional but helpful for debugging)
        return null;
    }

};

export default AIProcess;


 


