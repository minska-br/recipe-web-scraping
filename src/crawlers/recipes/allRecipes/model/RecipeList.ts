import replaceAll from "../../../../utils/replaceAll";
import RecipeListItem from "./RecipeListItem";

export default class RecipeList {
  constructor(private html: any[]) {}

  getFormatedList(): RecipeListItem[] {
    const formattedList = this.html.map((element: string) => {
      const elementInfos = element.split("</div>", 5).map((item) => replaceAll(item, ["\n"]));
      return new RecipeListItem(elementInfos);
    });

    const validFormattedList = formattedList.filter((item) => Boolean(item.Id));
    return validFormattedList;
  }
}
