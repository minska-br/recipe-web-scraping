import { NextFunction, Request, Response } from 'express';

import RecipesService from '../services/recipesService';

export default class RecipeController {
  constructor(private recipesService?: RecipesService) {
    this.recipesService = new RecipesService();
  }

  search = async (request: Request, response: Response, next: NextFunction) => {
    const { value } = request.query;

    if (!value) {
      return response.status(400).json({ message: "Value is required to search recipes." });
    }

    const recipe = await this.recipesService.search(value as string, false);

    if (recipe) return response.json(recipe);
    else return response.status(404).json({ message: "Recipe not found" });
  };

  list = async (request: Request, response: Response, next: NextFunction) => {
    const { value } = request.query;

    if (!value) {
      return response
        .status(400)
        .json({ message: '"Value" is a required parameter to search recipes.' });
    }

    const recipes = await this.recipesService.list(value as string, false);

    if (recipes) return response.json(recipes);

    return response.status(404).json({ message: "Recipes not found" });
  };
}
