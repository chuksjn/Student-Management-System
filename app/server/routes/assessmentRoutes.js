import { Router } from 'express';
import {
  addAssessment,
  getAssessments,
  updateAssessment,
} from '../controllers/assessments.js';

const router = Router();

router.post('/assessments', addAssessment);
router.put('/assessments', updateAssessment);
router.get('/assessments/:moduleName', getAssessments);

// Delete a record by ID

export const assessmentsRouter = router;
