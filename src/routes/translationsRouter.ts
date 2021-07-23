import { Router } from "express";
import TranslatorController from "../controllers/TranslatorController";

const translatorController = new TranslatorController();

const translationsRouter = Router();

translationsRouter.get("/", translatorController.translate);
translationsRouter.post("/", translatorController.translateMany);

export default translationsRouter;
