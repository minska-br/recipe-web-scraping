import Direction from '../../../../common/Direction';
import Ingredient from '../../../../common/Ingredient';
import receiptUnits from '../../../../constants/receiptUnits';
import removeTagsHTML from '../../../../utils/removeTagsHTML';
import replaceAll from '../../../../utils/replaceAll';
import toCapitalizedCase from '../../../../utils/toCapitalizedCase';
import CrawledRecipe from '../../CrawledRecipeHTML';

export default class RecipeDetail {
  private romovables = ["\n"];
  private name: string = "";
  private ingredients: Ingredient[] = [];
  private directions: Direction[] = [];
  private orderedRecipeUnits: string[];

  constructor(crawledRecipe: CrawledRecipe) {
    this.orderedRecipeUnits = receiptUnits.sort((a, b) => b.length - a.length); // Order imports
    this.setName(crawledRecipe.NameHTML);
    this.setIngredients(crawledRecipe.IngredientsHTML);
    this.setDirections(crawledRecipe.DirectionsHTML);
  }

  public get Name(): string {
    return this.name;
  }

  private setName(html: string) {
    let name = replaceAll(html, this.romovables, "");
    name = removeTagsHTML(name).trim();
    this.name = name;
  }

  public get Ingedients(): Ingredient[] {
    return this.ingredients;
  }

  private setIngredients(html: string) {
    const whitespaceBetweenWords = " ";
    const defaultValue = "undefined";

    const ingredients = html
      .toString()
      .split('<li><span class="p-ingredient" tabindex="0" itemprop="recipeIngredient">')
      .filter((item) => Boolean(item))
      .map((item) => removeTagsHTML(item).trim());

    const ingredientsObj: Ingredient[] = ingredients.map((item) => {
      const itemWords = item.toLowerCase().split(whitespaceBetweenWords);
      const firstItemText = itemWords[0];
      const hasAmountNumber = !isNaN(Number(firstItemText)) || firstItemText.includes("/");

      // If doesn't have amount number, it returns the default value
      if (!hasAmountNumber)
        return { amount: defaultValue, unit: defaultValue, name: toCapitalizedCase(item) };

      // If has amount number and a receipt unit with single letter (Ex< g, l, ...), it returns the amount with this receipt unit
      const [amountText, ...nameText] = itemWords;
      const wholeNameText = nameText.join(whitespaceBetweenWords);
      const nameTextInit = nameText[0];
      const nameTextInitIsUnitWithSingleLetter = this.orderedRecipeUnits
        .filter((unit) => unit.length === 1)
        .some((unit) => unit === nameTextInit);

      if (nameTextInitIsUnitWithSingleLetter) {
        const nameTextWithoutUnitArray = nameText.slice(1, wholeNameText.length);
        const nameTextWithoutUnit = nameTextWithoutUnitArray.join(whitespaceBetweenWords);
        return {
          amount: `${amountText.trim()}`,
          unit: `${nameTextInit.toLowerCase()}`,
          name: toCapitalizedCase(nameTextWithoutUnit.replace("de ", "").replace("da ", "")),
        };
      }

      /**
       * If isn't a single letter receipt unit, it analyzes whether text without the number is a
       *  recipe unit of measure, but reducing the remaining text until more than one letter remains.
       */
      for (let len = wholeNameText.length; len > 1; len--) {
        // len > 1 = Receipt units with single letters already returned
        const nameTextInit = wholeNameText.substring(0, len);

        const recipeUnitUsed = this.orderedRecipeUnits
          .filter((unit) => unit.length > 1)
          .find((unit) => {
            return unit.includes(nameTextInit) && unit.length === nameTextInit.length;
          });

        if (recipeUnitUsed) {
          const nameTextFinal = wholeNameText.substring(len, wholeNameText.length).trim();
          return {
            amount: `${amountText.trim()}`,
            unit: `${recipeUnitUsed.toLowerCase()}`,
            name: toCapitalizedCase(nameTextFinal.replace("de ", "")).trim(),
          };
        }
      }

      return {
        amount: amountText.trim(),
        unit: defaultValue,
        name: toCapitalizedCase(wholeNameText),
      };
    });

    this.ingredients = ingredientsObj;
  }

  private setDirections(html: string) {
    const directions: Direction[] = html
      .split('<li><span tabindex="0">')
      .filter((items) => Boolean(items))
      .map((item) => removeTagsHTML(item).trim())
      .map((item, index) => {
        return { step: index + 1, name: toCapitalizedCase(item) };
      });

    this.directions = directions;
  }

  public get Directions(): Direction[] {
    return this.directions;
  }
}
