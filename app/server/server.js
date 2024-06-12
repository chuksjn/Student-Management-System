import express from 'express';
import fs from 'fs';
import errorHandler from './errors.js';
import { studentRouter } from './routes/studentRoutes.js';
import { fileRouter } from './routes/fileRoutes.js';
import cors from 'cors';
import { moduleRouter } from './routes/moduleRoutes.js';
import { tutorRouter } from './routes/tutorRoutes.js';
import { assessmentsRouter } from './routes/assessmentRoutes.js';
import { detailsRouter } from './routes/detailRoutes.js';
import { reportRouter } from './routes/reports.js';
const app = express();
const PORT = 3000;

app.use(cors());
// Implement your CRUD and file handling logic
// Body parser middleware
app.use(express.json());

// Routes
app.use('/api', studentRouter);
app.use('/api', moduleRouter);
app.use('/api', tutorRouter);
app.use('/api', detailsRouter);
app.use('/api', assessmentsRouter);
app.use('/api', reportRouter);
app.use('/api', fileRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
