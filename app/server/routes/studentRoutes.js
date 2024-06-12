import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from '../controllers/index.js';

const router = Router();

// Create a new record
router.post('/students', createStudent);

// Retrieve all students
router.get('/students', getStudents);

// Retrieve a specific record by ID
router.get('/students/:id', getStudent);

// Update a record by ID
router.put('/students/:id', updateStudent);

// Delete a record by ID
router.delete('/students/:id', deleteStudent);

export const studentRouter = router;
