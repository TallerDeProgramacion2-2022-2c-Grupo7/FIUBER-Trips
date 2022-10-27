import { Router } from 'express';
import { RulesController } from '../controllers';

const rulesRouter = Router();

rulesRouter.get('/', RulesController.getActiveRules);
rulesRouter.get('/:ruleId', RulesController.getRulesById);
rulesRouter.post('/', RulesController.updateRules);

export default rulesRouter;
