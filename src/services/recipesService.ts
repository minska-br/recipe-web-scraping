import receiptUnits from '../constants/receiptUnits';
import TudoGostosoCrawler from '../crawlers/tudoGostosoCrawler';
import Direction from '../model/Direction';
import Ingredient from '../model/Ingredient';
import Recipe from '../model/Recipe';
import removeTagsHTML from '../utils/removeTagsHTML';
import replaceAll from '../utils/replaceAll';
import toCapitalizedCase from '../utils/toCapitalizedCase';

class RecipesService {
  async search(value = "test", hideCrawler = true) {
    const romovables = ["\n"];
    const orderedRecipeUnits = receiptUnits.sort((a, b) => b.length - a.length);

    try {
      const tudoGostosoCrawler = new TudoGostosoCrawler();
      const recipeCrawled = await tudoGostosoCrawler.search(value, hideCrawler);

      if (!recipeCrawled) return null;

      let name = replaceAll(recipeCrawled.Name, romovables, "");
      name = removeTagsHTML(name).trim();

      let ingredients = await Promise.all(
        recipeCrawled.Ingredients.toString()
          .split('<li><span class="p-ingredient" tabindex="0" itemprop="recipeIngredient">')
          .filter((item) => Boolean(item))
          .map((item) => removeTagsHTML(item).trim())
      );
      const ingredientsObj: Ingredient[] = ingredients.map((item) => {
        const whitespaceBetweenWords = " ";
        const itemWords = item.split(whitespaceBetweenWords);
        const hasAmountNumber = !isNaN(Number(itemWords[0]));

        if (hasAmountNumber) {
          const receiptUnitUsed = orderedRecipeUnits.find((unit) => item.includes(unit));
          const [amountText, ...nameText] = item.split(receiptUnitUsed);
          const amount = `${amountText.trim()} ${receiptUnitUsed.trim()}`.trim();
          const igredientName = nameText.join(whitespaceBetweenWords).replace("de ", "").trim();

          return { amount, name: toCapitalizedCase(igredientName) };
        }

        return { amount: "indefinido", name: toCapitalizedCase(item) };
      });

      const directions: Direction[] = recipeCrawled.Directions.split('<li><span tabindex="0">')
        .filter((items) => Boolean(items))
        .map((item) => removeTagsHTML(item).trim())
        .map((item, index) => {
          return { step: index + 1, name: toCapitalizedCase(item) };
        });

      return new Recipe(name, ingredientsObj, directions);
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }
}

export default RecipesService;
