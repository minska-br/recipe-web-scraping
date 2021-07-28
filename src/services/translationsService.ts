import Direction from "../common/Direction";
import Ingredient from "../common/Ingredient";
import Recipe from "../common/Recipe";
import TranslatorCrawler from "../crawlers/translator/translatorCrawler";
import toCapitalizedCase from "../utils/toCapitalizedCase";

class TranslatiosService {
  constructor(private translatorCrawler = new TranslatorCrawler()) {}

  async translate(value: string) {
    try {
      const translationResult = await this.translatorCrawler.translate(value);
      return translationResult;
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }

  async translateMany(values: string[], targetLang: string = "en") {
    try {
      const result = await this.translatorCrawler.translateMany(values);

      return result;
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }

  async translateRecipe(recipe: Recipe, targetLang: string = "en") {
    try {
      const initialValue = "";
      const separator = "<br>";

      const ingredients = recipe.Ingredients.reduce((total, current) => {
        return total + `${current.amount}: ${current.name} ${separator}`;
      }, initialValue);

      const directions = recipe.Directions.reduce((total, current) => {
        return total + `${current.step}: ${current.name} ${separator}`;
      }, initialValue);

      const nameTranslation = await this.translatorCrawler.translate(recipe.Name);
      const ingredientsTranslation = await this.translatorCrawler.translate(ingredients);
      const directionsTranslation = await this.translatorCrawler.translate(directions);

      const translatedIngredients: Ingredient[] = ingredientsTranslation
        .split(separator)
        .filter((direction) => Boolean(direction.trim()))
        .map((direction) => {
          const [amountValue, nameValue] = direction.split(":");
          return {
            amount: toCapitalizedCase(amountValue.trim()),
            name: toCapitalizedCase(nameValue.trim()),
          };
        });

      const translatedDirections: Direction[] = directionsTranslation
        .split(separator)
        .filter((direction) => Boolean(direction.trim()))
        .map((direction) => {
          const [stepNum, nameValue] = direction.split(":");
          return { step: parseInt(stepNum), name: toCapitalizedCase(nameValue.trim()) };
        });

      const translatedRecipe = new Recipe(
        nameTranslation,
        translatedIngredients,
        translatedDirections
      );

      return translatedRecipe;
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }
}

export default TranslatiosService;
