import Direction from '../../../../common/Direction';
import Ingredient from '../../../../common/Ingredient';
import toCapitalizedCase from '../../../../utils/toCapitalizedCase';
import CrawledRecipe from '../../CrawledRecipeHTML';

export default class RecipeDetail {
  private name: string = "";
  private ingredients: Ingredient[] = [];
  private directions: Direction[] = [];

  constructor(crawledRecipe: CrawledRecipe) {
    this.setName(crawledRecipe.NameHTML);
    this.setIngredients(crawledRecipe.IngredientsHTML);
    this.setDirections(crawledRecipe.DirectionsHTML);
  }

  public get Name(): string {
    return this.name;
  }

  private setName(html: string) {
    this.name = html;
  }

  public get Ingedients(): Ingredient[] {
    return this.ingredients;
  }

  private setIngredients(html: string) {
    const defaultValue = "undefined";
    const arrIngredients = html.split("</li>");

    const getValue = (item: any) => item.trim().split("=")[1].replace(/\"/g, "");

    const ingredientsItems: Ingredient[] = arrIngredients
      .filter((info: any) => Boolean(info.split("data")[7]))
      .map((info: any) => {
        const infos = info.split("data");

        return {
          amount: getValue(infos[5]) || defaultValue,
          unit: getValue(infos[6]) || defaultValue,
          name: toCapitalizedCase(getValue(infos[7])),
        };
      });

    this.ingredients = ingredientsItems;
  }

  private setDirections(html: string) {
    const arrdirections = html.split("</li>");

    const getNameValue = (item: any) =>
      item.substring(item.indexOf("<p>") + 3, item.indexOf("</p>")).trim();

    const directionsItems: Direction[] = arrdirections
      .map((info) => getNameValue(info))
      .filter((name) => Boolean(name))
      .map((name, index) => ({ step: index + 1, name }));

    this.directions = directionsItems;
  }

  public get Directions(): Direction[] {
    return this.directions;
  }
}
