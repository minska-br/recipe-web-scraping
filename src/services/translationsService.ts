import Recipe from "../common/Recipe";
import TranslatorCrawler from "../crawlers/translator/translatorCrawler";

class TranslatiosService {
  constructor(private translatorCrawler = new TranslatorCrawler()) {}

  async translate(value: string) {
    try {
      const translationResult = await this.translatorCrawler.translate(value);
      return translationResult;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }

  async translateRecipe(recipe: Recipe, targetLang: string = "en"): Promise<Recipe> {
    try {
      const result = await Promise.all([this.translate(recipe.Name)]);

      console.log(">>> translation result: ", result);
      return null;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }
}

export default TranslatiosService;
