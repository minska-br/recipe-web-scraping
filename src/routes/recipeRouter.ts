import { Router } from "express";
import RecipeController from "../controllers/RecipeController";

const recipeController = new RecipeController();

const recipeRouter = Router();

recipeRouter.get("/", recipeController.list);
recipeRouter.post("/", recipeController.searchFirst);

export default recipeRouter;
