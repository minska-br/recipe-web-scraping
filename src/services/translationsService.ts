import Direction from '../common/Direction';
import Ingredient from '../common/Ingredient';
import Recipe from '../common/Recipe';
import TranslatorCrawler from '../crawlers/translator/translatorCrawler';

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
      const initialValue = [];
      const getValues = (obj) => Object.values(obj);

      const convertIngredientToStringArray = (total, current) => [...total, ...getValues(current)];
      const ingredients = recipe.Ingredients.reduce(convertIngredientToStringArray, initialValue);

      const convertDirectionToStringArray = (total, current) => [...total, getValues(current)[1]];
      const directions = recipe.Directions.reduce(convertDirectionToStringArray, initialValue);

      const itensToTranslate = [recipe.Name, ...ingredients, ...directions];

      const result = await this.translatorCrawler.translateMany(itensToTranslate);

      const translatedIngredients: Ingredient[] = recipe.Ingredients.map((ingredient) => {
        return { amount: result[ingredient.amount], name: result[ingredient.name] };
      });

      const translatedDirections: Direction[] = recipe.Directions.map((direction) => {
        return { step: direction.step, name: result[direction.name] };
      });

      const translatedRecipe = new Recipe(
        result[recipe.Name],
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
