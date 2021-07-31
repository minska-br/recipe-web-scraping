import { NextFunction, Request, Response } from 'express';

import { info } from '../config/logger';
import NAMESPACE from '../enumerators/namespaces';
import RecipesService from '../services/recipesService';

export default class RecipeController {
  constructor(private recipesService?: RecipesService) {
    this.recipesService = new RecipesService();
  }

  searchFirst = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "searchFirst - initial values", infoToLog);

    const { value } = request.query;

    if (!value) {
      const message = "Value is required to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst", { message });
      return response.status(400).json({ message });
    }

    const recipe = await this.recipesService.searchFirst(value as string);

    if (recipe) {
      info(NAMESPACE.RecipeController, "searchFirst - recipe received", { recipe });
      return response.json(recipe);
    } else {
      info(NAMESPACE.RecipeController, "searchFirst - recipe not found", { recipe });
      return response.status(404).json({ message: "Recipe not found" });
    }
  };

  searchById = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "searchById - initial values", infoToLog);

    const { id } = request.params;

    const isNumber = !isNaN(Number(id));
    const isPositive = parseInt(id) > 0;
    const isValidId = isNumber && isPositive;

    if (!isValidId) return response.status(400).json({ message: "id is not valid." });

    const recipe = await this.recipesService.searchById(parseInt(id));

    if (recipe) return response.json(recipe);
    else return response.status(404).json({ message: "Recipe not found" });
  };

  list = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "list - initial values", infoToLog);

    const { value } = request.query;

    if (!value) {
      const message = '"Value" is a required parameter to search recipes.';
      info(NAMESPACE.RecipeController, `list - ${message}`, { value });
      return response.status(400).json({ message });
    }

    const recipes = await this.recipesService.list(value as string);

    if (recipes) {
      info(NAMESPACE.RecipeController, `list - recipes received`, { recipes });
      return response.json(recipes);
    }

    const message = "Recipes not found";
    info(NAMESPACE.RecipeController, `list - ${message}`, { recipes });
    return response.status(404).json({ message });
  };
}
