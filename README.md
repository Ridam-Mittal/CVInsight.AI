# Resume/JD Analyzer 🚀

This project is a powerful tool designed to analyze resumes against job descriptions, providing users with valuable insights to improve their applications. It offers features like match score calculation, skill gap analysis, and personalized recommendations, all powered by AI. This helps job seekers tailor their resumes for specific roles, increasing their chances of landing interviews.

## 🚀 Key Features

- **Resume/JD Upload**: Easily upload your resume and the job description you're targeting. 📄⬆️
- **AI-Powered Analysis**: Utilizes advanced AI algorithms to analyze the content of your resume and JD. 🤖
- **Match Score**: Provides a match score indicating how well your resume aligns with the job description. 💯
- **Skill Gap Analysis**: Identifies missing skills in your resume compared to the job description requirements. 技能
- **Personalized Recommendations**: Offers tailored suggestions to improve your resume and highlight relevant skills. 💡
- **Course Recommendations**: Suggests relevant online courses to bridge skill gaps. 📚
- **Analysis History**: Keeps track of your past analyses for easy reference. 🕰️
- **User Authentication**: Secure user accounts with signup, login, and password reset functionalities. 🔒

## 🛠️ Tech Stack

*   **Frontend**:
    *   React: JavaScript library for building user interfaces.
    *   React Router DOM: For handling routing within the application.
    *   Axios: For making HTTP requests to the backend API.
    *   react-hot-toast: For displaying toast notifications.
    *   FontAwesome: For icons.
*   **Backend**:
    *   Node.js: JavaScript runtime environment.
    *   Express.js: Web application framework.
    *   Mongoose: MongoDB object modeling tool.
    *   bcrypt: For password hashing.
    *   jsonwebtoken: For creating and verifying JWTs.
    *   cors: Enables Cross-Origin Resource Sharing.
    *   cookie-parser: Parses cookies from the request headers.
    *   Multer: Middleware for handling file uploads.
*   **Database**:
    *   MongoDB: NoSQL database.
*   **AI**:
    *   `@inngest/agent-kit`: Library for creating and managing AI agents.
    *   Gemini AI: AI model for resume analysis.
*   **Background Jobs**:
    *   Inngest: For background job processing (e.g., sending emails).
*   **Email**:
    *   Nodemailer: Library for sending emails from Node.js.
*   **Build Tools**:
    *   dotenv: Loads environment variables from a `.env` file.

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB installed and running
- Mailtrap account (for testing email functionality)
- Gemini API Key
- Inngest Account

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install backend dependencies:

    ```bash
    cd backend
    npm install  # or yarn install
    ```

3.  Install frontend dependencies:

    ```bash
    cd ../frontend
    npm install  # or yarn install
    ```

4.  Create a `.env` file in both the `backend` and `frontend` directories and configure the following environment variables:

    **Backend (.env):**

    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    MAILTRAP_SMTP_HOST=<mailtrap_smtp_host>
    MAILTRAP_SMTP_PORT=<mailtrap_smtp_port>
    MAILTRAP_SMTP_USER=<mailtrap_smtp_user>
    MAILTRAP_SMTP_PASS=<mailtrap_smtp_pass>
    GEMINI_API_KEY=<your_gemini_api_key>
    INNGEST_EVENT_KEY=<your_inngest_event_key>
    INNGEST_SIGNING_KEY=<your_inngest_signing_key>
    ```

    **Frontend (.env):**

    ```
    VITE_BACKEND_URL=http://localhost:8000 # or your backend URL
    ```

### Running Locally

1.  Start the backend server:

    ```bash
    cd backend
    npm run dev # or yarn dev
    ```

2.  Start the frontend development server:

    ```bash
    cd ../frontend
    npm run dev # or yarn dev
    ```

    The frontend application will be accessible at `http://localhost:5173` (or the port specified by Vite).

## 📂 Project Structure

```
Resume-JD-Analyzer/
├── backend/
│   ├── index.js          # Main entry point for the backend application
│   ├── routes/
│   │   ├── analysis.js   # Routes for analysis-related functionalities
│   │   └── auth.js       # Routes for authentication-related functionalities
│   ├── controllers/
│   │   ├── analysis.js   # Controller logic for analysis requests
│   │   └── auth.js       # Controller logic for authentication operations
│   ├── models/
│   │   ├── analysis.js   # Mongoose model for analysis data
│   │   └── user.js       # Mongoose model for user data
│   ├── middlewares/
│   │   ├── auth.js       # Authentication middleware
│   │   └── multer.js     # Multer middleware for file uploads
│   ├── db/
│   │   └── db.js         # Database connection logic
│   ├── utils/
│   │   ├── ai.js         # AI processing module
│   │   └── mailer.js     # Utility function for sending emails
│   ├── inngest/
│   │   ├── client.js     # Inngest client initialization
│   │   └── functions/
│   │       ├── on-request-mail.js # Inngest function for sending emails
│   │       └── on-otp-request.js  # Inngest function for sending OTPs
│   └── package.json      # Backend dependencies and scripts
├── frontend/
│   ├── src/
│   │   ├── main.jsx        # Entry point for the React application
│   │   ├── App.jsx         # Main landing page component
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Navigation bar component
│   │   │   ├── Footer.jsx    # Footer component
│   │   │   └── How.jsx       # How it works component
│   │   ├── pages/
│   │   │   ├── Login.jsx     # Login page component
│   │   │   ├── Signup.jsx    # Signup page component
│   │   │   └── ...           # Other page components
│   │   ├── index.css       # Global CSS styles
│   │   └── ...
│   ├── public/
│   │   └── vite.svg
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies and scripts
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── README.md             # Project documentation
└── ...
```

## 📸 Screenshots

(Add screenshots of the application here to showcase its features and UI)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [your-email@example.com](mailto:your-email@example.com).

## 💖 Thanks

Thank you for checking out this project! I hope it helps you improve your resume and land your dream job.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/).
