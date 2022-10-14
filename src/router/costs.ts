import { Router } from 'express';
import { CostController } from '../controllers';

const costRouter = Router();

costRouter.get('/calculate', CostController.calculate);

export default costRouter;
