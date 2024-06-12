import express from 'express';
import { getFolderInfo } from '../controllers/files.js';

const router = express.Router();

// Get folder information
router.get('/folder-info', getFolderInfo);

export const fileRouter = router;
