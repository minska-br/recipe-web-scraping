import { Router } from "express";
import RecipeController from "../controllers/RecipeController";

const recipeController = new RecipeController();

const recipeRouter = Router();

recipeRouter.get("/:crawlerName", recipeController.list);
recipeRouter.post("/:crawlerName", recipeController.searchFirst);
recipeRouter.post("/:crawlerName/:id", recipeController.searchById);

export default recipeRouter;
