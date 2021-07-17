import Direction from '../common/Direction';
import Ingredient from '../common/Ingredient';
import Recipe from '../common/Recipe';
import receiptUnits from '../constants/receiptUnits';
import RecipeList from '../crawlers/tudoGostoso/model/RecipeList';
import TudoGostosoCrawler from '../crawlers/tudoGostoso/tudoGostosoCrawler';
import removeTagsHTML from '../utils/removeTagsHTML';
import replaceAll from '../utils/replaceAll';
import toCapitalizedCase from '../utils/toCapitalizedCase';

class RecipesService {
  constructor(private tudoGostosoCrawler = new TudoGostosoCrawler()) {}

  async list(value = "test", hideCrawler = true) {
    try {
      const recipesCrawled = await this.tudoGostosoCrawler.getList(value, hideCrawler);

      const recipeListItem = new RecipeList(recipesCrawled);

      const formatedList = recipeListItem.getFormatedList();

      return formatedList;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }

  async search(value = "test", hideCrawler = true) {
    const romovables = ["\n"];
    const orderedRecipeUnits = receiptUnits.sort((a, b) => b.length - a.length);

    try {
      const recipeCrawled = await this.tudoGostosoCrawler.getDetail(value, hideCrawler);

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
        const itemWords = item.toLowerCase().split(whitespaceBetweenWords);
        const firstItemText = itemWords[0];
        const hasAmountNumber = !isNaN(Number(firstItemText)) || firstItemText.includes("/");

        if (hasAmountNumber) {
          const [amountText, ...nameText] = itemWords;
          const wholeNameText = nameText.join(whitespaceBetweenWords);

          const nameTextInit = nameText[0];
          const nameTextInitIsUnitWithSingleLetter = orderedRecipeUnits
            .filter((unit) => unit.length === 1)
            .some((unit) => unit === nameTextInit);

          if (nameTextInitIsUnitWithSingleLetter) {
            const nameTextWithoutUnitArray = nameText.slice(1, wholeNameText.length);
            const nameTextWithoutUnit = nameTextWithoutUnitArray.join(whitespaceBetweenWords);
            return {
              amount: `${amountText.trim()} ${nameTextInit.toLowerCase()}`,
              name: toCapitalizedCase(nameTextWithoutUnit.replace("de ", "")),
            };
          }

          // len > 1 = Units with single letters already returned
          for (let len = wholeNameText.length; len > 1; len--) {
            /**
             * Analyzes whether text without the number is a revenue unit of measure, but reducing the
             * remaining text until more than one letter remains.
             */
            const nameTextInit = wholeNameText.substring(0, len);

            const recipeUnitUsed = orderedRecipeUnits
              .filter((unit) => unit.length > 1)
              .find((unit) => {
                return unit.includes(nameTextInit) && unit.length === nameTextInit.length;
              });

            if (recipeUnitUsed) {
              const nameTextFinal = wholeNameText.substring(len, wholeNameText.length).trim();
              return {
                amount: `${amountText.trim()} ${recipeUnitUsed.toLowerCase()}`,
                name: toCapitalizedCase(nameTextFinal.replace("de ", "")).trim(),
              };
            }
          }
          return { amount: amountText.trim(), name: toCapitalizedCase(wholeNameText) };
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
