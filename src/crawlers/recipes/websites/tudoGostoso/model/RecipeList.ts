import RecipeIndex from '../../../../../common/types/RecipeIndex';
import replaceAll from '../../../../../utils/replaceAll';
import RecipeListAncestor from '../../../models/RecipeListAncestor';
import RecipeListItem from './RecipeListItem';

export default class RecipeList extends RecipeListAncestor {
  constructor(private html: any[]) {
    super();
  }

  getFormatedList(): RecipeIndex {
    const formattedList = this.html.map((element: string) => {
      const elementInfos = element.split("</div>", 5).map((item) => replaceAll(item, ["\n"]));
      return new RecipeListItem(elementInfos);
    });

    const validFormattedList: RecipeIndex = formattedList
      .filter((item) => Boolean(item.Id))
      .map((item) => ({ id: item.Id, name: item.Name }));

    return validFormattedList;
  }
}
