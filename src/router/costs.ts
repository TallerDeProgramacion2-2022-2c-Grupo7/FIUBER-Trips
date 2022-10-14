import { Router } from 'express';
import { CostController } from '../controllers';

const costRouter = Router();

costRouter.post('/calculate', CostController.calculate);

export default costRouter;
