import Direction from "../../../../../common/interfaces/Direction";
import Ingredient from "../../../../../common/interfaces/Ingredient";
import DEFAULT_AMOUNT from "../../../../../constants/defaultAmount";
import DEFAULT_UNIT from "../../../../../constants/defaultUnit";
import toCapitalizedCase from "../../../../../utils/toCapitalizedCase";
import CrawledRecipe from "../../../models/CrawledRecipeHTML";
import fs from "fs";
import { error, getTimestamp, info } from "../../../../../config/Logger";
import NAMESPACES from "../../../../../enumerators/namespaces";

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
    const arrIngredients = html.split("</li>");

    const getValue = (item: any) => item.trim().split("=")[1].replace(/\"/g, "");

    const ingredientsItems: Ingredient[] = arrIngredients
      .filter((info: any) => Boolean(info.split("data")[7]))
      .map((info: any) => {
        const infos = info.split("data");

        const unitValue = getValue(infos[6]) || DEFAULT_UNIT;
        if (unitValue == DEFAULT_UNIT) {
          fs.appendFile(
            "unknowed-units.txt",
            `[${getTimestamp()}][${this.Name}] ${info}\r\n`,
            function (err) {
              if (err) error(NAMESPACES.AllRecipesCrawler, "RecipeDetail > setIngredients", err);

              console.error("Unknowed unit:" + infos[6]);
            }
          );
        }

        return {
          amount: Number(getValue(infos[5])) ?? DEFAULT_AMOUNT,
          unit: unitValue,
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
