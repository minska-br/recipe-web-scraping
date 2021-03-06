import { NextFunction, Request, Response } from 'express';

import { info } from '../config/Logger';
import Crawlers from '../enumerators/crawlers';
import NAMESPACE from '../enumerators/namespaces';
import RecipesService from '../services/recipesService';
import getCrawlerEnum from '../utils/getCrawlerEnum';
import getLanguageCodeEnum from '../utils/getLanguageCodeEnum';

export default class RecipeController {
  constructor(private recipesService = new RecipesService()) {}

  searchFirst = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "searchFirst - initial values", infoToLog);

    const { value, targetLang } = request.query;
    const { crawlerName } = request.params;

    if (!value) {
      const message = "Required parameter 'value' not received to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    if (!crawlerName) {
      const message = "Required parameter 'crawlerName' not received to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    const crawlerEnumValue = getCrawlerEnum(crawlerName);
    if (!crawlerEnumValue) {
      const message = "Required parameter 'crawlerName' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    const targetLangValue = getLanguageCodeEnum(targetLang as string);
    if (targetLangValue === null) {
      const message = "Required parameter 'targetLang' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    const recipe = await this.recipesService.searchFirst(
      crawlerEnumValue,
      value as string,
      targetLangValue
    );

    if (recipe) {
      info(NAMESPACE.RecipeController, "searchFirst -  response (200)", { recipe });
      return response.json(recipe);
    } else {
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { recipe });
      return response.status(404).json({ message: "Recipe not found" });
    }
  };

  searchById = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "searchById - initial values", infoToLog);

    const { targetLang } = request.query;
    const { id, crawlerName } = request.params;

    const isNumber = !isNaN(Number(id));
    const isPositive = parseInt(id) > 0;
    const isValidId = isNumber && isPositive;

    if (!isValidId) {
      const message = "Required parameter 'id' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchById - response (400)", { id, message });
      return response.status(400).json({ message });
    }

    if (!crawlerName) {
      const message = "Required parameter 'crawlerName' not received to search recipes.";
      info(NAMESPACE.RecipeController, "searchById - response (400)", { message });
      return response.status(400).json({ message });
    }

    const crawlerEnumValue = getCrawlerEnum(crawlerName);
    if (!crawlerEnumValue) {
      const message = "Required parameter 'crawlerName' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchById - response (400)", { message });
      return response.status(400).json({ message });
    }

    const targetLangValue = getLanguageCodeEnum(targetLang as string);
    if (targetLangValue === null) {
      const message = "Required parameter 'targetLang' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    const recipe = await this.recipesService.searchById(
      crawlerEnumValue,
      parseInt(id),
      targetLangValue
    );

    if (recipe) {
      info(NAMESPACE.RecipeController, "searchById - response (200)", JSON.stringify(recipe));
      return response.json(recipe);
    } else {
      const message = "Recipe not found";
      info(NAMESPACE.RecipeController, "searchById - response (404)", { message });
      return response.status(404).json({ message });
    }
  };

  list = async (request: Request, response: Response, next: NextFunction) => {
    const infoToLog = { query: request.query, params: request.params };
    info(NAMESPACE.RecipeController, "list - initial values", infoToLog);

    const { value, sourceLang } = request.query;
    const { crawlerName } = request.params;

    if (!value) {
      const message = '"Value" is a required parameter to search recipes.';
      info(NAMESPACE.RecipeController, `list - response (400)`, { value, message });
      return response.status(400).json({ message });
    }

    if (!crawlerName) {
      const message = "Required parameter 'crawlerName' not received to search recipes.";
      info(NAMESPACE.RecipeController, "searchById - response (400)", { message });
      return response.status(400).json({ message });
    }

    const crawlerEnumValue = Object.values(Crawlers).find(
      (item) => item.toLowerCase() === crawlerName.toLowerCase()
    ) as Crawlers;

    const isValidCrawler = !!crawlerEnumValue;

    if (!isValidCrawler) {
      const message = "Required parameter 'crawlerName' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchById - response (400)", { message });
      return response.status(400).json({ message });
    }

    const sourceLangValue = getLanguageCodeEnum(sourceLang as string);
    if (sourceLangValue === null) {
      const message = "Required parameter 'sourceLang' not valid to search recipes.";
      info(NAMESPACE.RecipeController, "searchFirst - response (400)", { message });
      return response.status(400).json({ message });
    }

    const recipes = await this.recipesService.list(
      crawlerEnumValue,
      value as string,
      sourceLangValue
    );

    if (recipes) {
      const infoObj = { recipes: typeof recipes, count: recipes.length };
      info(NAMESPACE.RecipeController, `list - response (200)`, infoObj);
      return response.json(recipes);
    }

    const message = "Recipes not found";
    info(NAMESPACE.RecipeController, `list - response (404)`, { message });
    return response.status(404).json({ message });
  };
}
