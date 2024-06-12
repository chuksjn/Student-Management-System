import { Router } from 'express';
import {
  createTutor,
  deleteTutor,
  getTutor,
  getTutors,
  updateTutor,
} from '../controllers/tutors.js';

const router = Router();

// Create a new record
router.post('/tutors', createTutor);

// Retrieve all tutors
router.get('/tutors', getTutors);

// Retrieve a specific record by ID
router.get('/tutors/:id', getTutor);

// Update a record by ID
router.put('/tutors/:id', updateTutor);

// Delete a record by ID
router.delete('/tutors/:id', deleteTutor);

export const tutorRouter = router;
