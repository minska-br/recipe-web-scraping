import replaceAll from '../../../utils/replaceAll';
import RecipeListitem from './RecipeIListtem';

export default class RecipeList {
  constructor(private html: any[]) {}

  getFormatedList(): RecipeListitem[] {
    const formattedList = this.html.map((element: string) => {
      const elementInfos = element.split("</div>", 5).map((item) => replaceAll(item, ["\n"]));
      return new RecipeListitem(elementInfos);
    });

    const validFormattedList = formattedList.filter((item) => Boolean(item.Id));
    return validFormattedList;
  }
}
