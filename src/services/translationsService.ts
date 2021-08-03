import Direction from '../common/interfaces/Direction';
import Ingredient from '../common/interfaces/Ingredient';
import Recipe from '../common/models/Recipe';
import RecipeIndex from '../common/types/RecipeIndex';
import { error, info } from '../config/Logger';
import TranslatorCrawler from '../crawlers/translator/translatorCrawler';
import LanguageCode from '../enumerators/language-codes';
import NAMESPACES from '../enumerators/namespaces';
import toCapitalizedCase from '../utils/toCapitalizedCase';

class TranslatiosService {
  constructor(private translatorCrawler = new TranslatorCrawler()) {}

  async translate(value: string, targetLang = LanguageCode.en) {
    info(NAMESPACES.TranslatiosService, "translate", { value, targetLang });
    this.translatorCrawler.TargetLang = targetLang;

    try {
      const translationResult = await this.translatorCrawler.translate(value);
      info(NAMESPACES.TranslatiosService, "translate - result", { translationResult });
      return translationResult;
    } catch (err) {
      error(NAMESPACES.TranslatiosService, "translate", err);
      return null;
    }
  }

  async translateMany(values: string[], targetLang = LanguageCode.en) {
    info(NAMESPACES.TranslatiosService, "translateMany", { values, targetLang });
    this.translatorCrawler.TargetLang = targetLang;
    try {
      const result = await this.translatorCrawler.translateMany(values);
      info(NAMESPACES.TranslatiosService, "translateMany - result", { result });
      return result;
    } catch (err) {
      error(NAMESPACES.TranslatiosService, "translateMany", err);
      return null;
    }
  }

  async translateRecipe(recipe: Recipe, targetLang = LanguageCode.en) {
    info(NAMESPACES.TranslatiosService, "translateRecipe", { targetLang, recipe });
    this.translatorCrawler.TargetLang = targetLang;

    try {
      const initialValue = "";
      const separator = " § ";

      const nameTranslation = await this.translatorCrawler.translate(recipe.Name);
      const infoName = { nameTranslation };
      info(NAMESPACES.TranslatiosService, "translateRecipe - Name translation", infoName);

      /* Ingredients translation*/
      const ingredients = recipe.Ingredients.reduce((total, current) => {
        return total + `${current.amount}: ${current.name}; ${current.unit} ${separator}`;
      }, initialValue);

      const ingredientsTranslation = await this.translatorCrawler.translate(ingredients);
      info(NAMESPACES.TranslatiosService, "translateRecipe - Ingredients translation", {
        ingredientsTranslation,
      });

      const translatedIngredients: Ingredient[] = ingredientsTranslation
        .split(separator.trim()) // Avoid separator value to return in as value integrant
        .filter((direction) => Boolean(direction?.trim()))
        .map((direction) => {
          const [amountValue, ingredientParts] = direction.split(":");
          const [nameValue, unitValue] = ingredientParts.split(";");

          return {
            amount: toCapitalizedCase(amountValue.trim()),
            unit: toCapitalizedCase(unitValue.trim()),
            name: toCapitalizedCase(nameValue.trim()),
          };
        });

      /* Directions translation*/
      const directions = recipe.Directions.reduce((total, current) => {
        return total + `${current.step}: ${current.name} ${separator}`;
      }, initialValue);

      const directionsTranslation = await this.translatorCrawler.translate(directions);
      info(NAMESPACES.TranslatiosService, "translateRecipe - Directions translation", {
        directionsTranslation,
      });

      const translatedDirections: Direction[] = directionsTranslation
        .split(separator.trim()) // Avoid separator value to return in as value integrant
        .filter((direction) => Boolean(direction?.trim()))
        .map((direction) => {
          const [stepNum, nameValue] = direction.split(":");
          return { step: parseInt(stepNum), name: toCapitalizedCase(nameValue.trim()) };
        });

      /* Recipe translation result*/
      const translatedRecipe = new Recipe(
        nameTranslation,
        translatedIngredients,
        translatedDirections
      );

      return translatedRecipe;
    } catch (err) {
      error(NAMESPACES.TranslatiosService, "translateRecipe", err);
      return null;
    }
  }

  async translateRecipeIndex(recipeIndex: RecipeIndex, targetLang = LanguageCode.pt) {
    info(NAMESPACES.TranslatiosService, "translateRecipeIndex", { targetLang, recipeIndex });
    this.translatorCrawler.TargetLang = targetLang;

    try {
      const initialValue = "";
      const separator = " § ";

      const indexOfRecipes = recipeIndex.reduce((total, current) => {
        return total + `${current.id}: ${current.name} ${separator}`;
      }, initialValue);

      const indexOfRecipesTranslation = await this.translatorCrawler.translate(indexOfRecipes);
      info(NAMESPACES.TranslatiosService, "translateRecipe - Recipes index translation", {
        indexOfRecipesTranslation,
      });

      const translatedRecipeIndex: RecipeIndex = indexOfRecipesTranslation
        .split(separator.trim()) // Avoid separator value to return in as value integrant
        .filter((direction) => Boolean(direction?.trim()))
        .map((direction) => {
          const [idValue, nameValue] = direction.split(":");
          return { id: parseInt(idValue), name: toCapitalizedCase(nameValue.trim()) };
        });

      return translatedRecipeIndex;
    } catch (err) {
      error(NAMESPACES.TranslatiosService, "translateRecipe", err);
      return null;
    }
  }
}

export default TranslatiosService;
