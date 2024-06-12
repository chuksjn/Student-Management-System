import express from 'express';
import { generateStudentReport } from '../controllers/report.js';

const router = express.Router();

// Get folder information
router.get('/student-report/:studentId', generateStudentReport);

export const reportRouter = router;
