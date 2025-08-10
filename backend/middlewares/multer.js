import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage });

// console.log("🧠 Multer middleware registered ", process.env.MAILTRAP_SMTP_HOST);