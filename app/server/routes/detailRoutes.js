import express from 'express';
import {
  addDetails,
  getDetails,
  updateDetail,
} from '../controllers/details.js';

const router = express.Router();

router.post('/details/:moduleName', addDetails);
router.put('/details/:moduleName', updateDetail);
router.get('/details/:moduleName', getDetails);

export const detailsRouter = router;
