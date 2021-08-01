import { NextFunction, Request, Response } from "express";
import Recipe from "../common/Recipe";
import TranslatiosService from "../services/translationsService";

export default class TranslatorController {
  constructor(private translationsService: TranslatiosService = new TranslatiosService()) {}

  translate = async (request: Request, response: Response, next: NextFunction) => {
    const { value } = request.query;

    if (!value) {
      return response.status(400).json({ message: "Value is required to translate." });
    }

    const result = await this.translationsService.translate(value as string);

    if (result) return response.json({ result });
    else return response.status(404).json({ message: "Recipe not found" });
  };

  translateMany = async (request: Request, response: Response, next: NextFunction) => {
    const { values } = request.body;

    if (!values) {
      return response.status(400).json({ message: "Values are required to translation." });
    }

    const result = await this.translationsService.translateMany(values as string[]);

    if (result) return response.json({ result });
    else return response.status(404).json({ message: "Recipe not found" });
  };

  translateRecipe = async (request: Request, response: Response, next: NextFunction) => {
    const { recipe } = request.body;

    if (!recipe) {
      return response.status(400).json({ message: "Recipe is required to translation." });
    }

    const recipeObj = new Recipe(recipe.name, recipe.ingredients, recipe.directions);
    const result = await this.translationsService.translateRecipe(recipeObj);

    if (result) return response.json({ result });
    else return response.status(404).json({ message: "Translation not found" });
  };
}
