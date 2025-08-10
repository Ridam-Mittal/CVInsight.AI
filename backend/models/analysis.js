import mongoose from "mongoose";


const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resumeText: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    matchScore: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        required: true
    },
    missingSkills: [
        {
            type: String
        }
    ],
    suggestedImprovements: {
        type: String,
    },
    company: {
        type: String
    },
    jobTitle: {
        type: String
    },
    topMatchSkills: [
        {
            type: String
        }
    ],
    jobDescriptionSummary: {
        type: String
    },
    courseLinks: [
        {
            courseTopic: {
                type: String
            },
            courseLink: {
                type: String
            }
        }
    ],
    preparationTips: {
        type: String
    },
    emailSentAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})



export const Analysis = mongoose.model('Analysis', analysisSchema);