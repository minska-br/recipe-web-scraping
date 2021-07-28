import { Router } from 'express';

import TranslatorController from '../controllers/TranslatorController';

const translatorController = new TranslatorController();

const translationsRouter = Router();

translationsRouter.get("/", translatorController.translate);
translationsRouter.post("/", translatorController.translateMany);
translationsRouter.post("/recipe", translatorController.translateRecipe);

export default translationsRouter;
