import { NonRetriableError } from "inngest";
import { User } from "../../models/user.js";
import { Analysis } from "../../models/analysis.js";
import { inngest } from "../client.js";
import { sendMail } from "../../utils/mailer.js";

// Helper to convert plain JD text to basic HTML
function formatTextAsHtml(text) {
  return text
    .split("\n")
    .map(line => `<p style="margin: 0 0 8px 0;">${line.trim()}</p>`)
    .join("");
}

export const OnRequestMail = inngest.createFunction(
  { id: "on-request-mail", retries: 2 },
  { event: "mail/request" },
  async ({ event, step }) => {
    try {
      const { userId, email, analysisId } = event.data;

      const user = await step.run("get-user", async () => {
        const found = await User.findById(userId);
        if (!found) throw new NonRetriableError("User not found.");
        return found;
      });

      const result = await step.run("get-analysis", async () => {
        const found = await Analysis.findById(analysisId);
        if (!found) throw new NonRetriableError("Analysis result not found.");
        return found;
      });

      await step.run("send-email", async () => {
        const subject = "📊 Your Resume Analysis Report";
        const text = `
        Hello ${user.email},

        Your resume analysis is complete!

        Match Score: ${result.matchScore}
        Summary: ${result.summary}
        Missing Skills: ${result.missingSkills.join(", ")}
        Top Matching Skills: ${result.topMatchSkills.join(", ")}
        Suggested Improvements: ${result.suggestedImprovements}

        Company: ${result.company || "N/A"}
        Job Title: ${result.jobTitle || "N/A"}
        Job Summary: ${result.jobDescriptionSummary || "N/A"}

        Preparation Tips:
        ${result.preparationTips || "N/A"}

        Courses for Improvement:
        ${result.courseLinks.map(link => `- ${link.courseTopic}: ${link.courseLink}`).join("\n")}

        Job Description:
        ${result.jobDescription}
          `;

        const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4F46E5;">📊 Your Resume Analysis Report</h2>

          <p><strong>Match Score:</strong> ${result.matchScore}%</p>
          <p><strong>Summary:</strong> ${result.summary}</p>
          <p><strong>Top Matching Skills:</strong> ${result.topMatchSkills.join(", ") || "None"}</p>
          <p><strong>Missing Skills:</strong> ${result.missingSkills.join(", ") || "None"}</p>
          <p><strong>Suggested Improvements:</strong> ${result.suggestedImprovements || "None"}</p>

          <hr/>
          <p><strong>🏢 Company:</strong> ${result.company || "N/A"}</p>
          <p><strong>🎯 Job Title:</strong> ${result.jobTitle || "N/A"}</p>
          <p><strong>📝 Job Summary:</strong> ${result.jobDescriptionSummary || "N/A"}</p>

          <hr/>
          <p><strong>📘 Preparation Tips:</strong></p>
          <p>${result.preparationTips || "N/A"}</p>

          <p><strong>🎓 Suggested Courses:</strong></p>
          <ul>
            ${result.courseLinks.map(link => `<li><strong>${link.courseTopic}</strong>: <a href="${link.courseLink}" target="_blank">${link.courseLink}</a></li>`).join("")}
          </ul>
        </div>
        `;

        await sendMail(email, subject, text, html);
      });


      await step.run("mark-mail-sent", async () => {
        const freshResult = await Analysis.findById(analysisId);
        if (!freshResult) throw new NonRetriableError("Analysis not found during save.");
        freshResult.emailSentAt = new Date();
        await freshResult.save();
      });

      return { success: true };
    } catch (error) {
      console.error("Error in mail/request function:", error.message);
      return { success: false };
    }
  }
);
