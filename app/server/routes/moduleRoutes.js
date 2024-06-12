import { Router } from 'express';
import {
  createModule,
  deleteModule,
  getModule,
  getModules,
  updateModule,
} from '../controllers/modules.js';

const router = Router();

// Create a new record
router.post('/modules', createModule);

// Retrieve all modules
router.get('/modules', getModules);

// Retrieve a specific record by ID
router.get('/modules/:id', getModule);

// Update a record by ID
router.put('/modules/:id', updateModule);

// Delete a record by ID
router.delete('/modules/:id', deleteModule);

export const moduleRouter = router;
