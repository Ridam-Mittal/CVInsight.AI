import { Router } from "express";
import { Analyze, deleteAnalysis, getHistory, getSingleHistory } from "../controllers/analysis.js";
import { upload } from './../middlewares/multer.js';
import { authenticate } from './../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'jd', maxCount: 1 }]) ,Analyze);

router.get('/history', authenticate, getHistory);

router.post('/single-history', authenticate, getSingleHistory);

router.post('/delete-analysis', authenticate, deleteAnalysis);
router.post('/test', (req, res) => {
  console.log("🔥 /api/analysis/test hit");
  res.send("Test route working");
});
export default router;