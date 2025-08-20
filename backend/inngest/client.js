import { Inngest } from "inngest";

export const inngest = new Inngest({
  name: "resume-analysis-system",       
  auth: process.env.INNGEST_EVENT_KEY, 
});