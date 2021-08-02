import RecipeIndex from '../../../../../common/types/RecipeIndex';
import RecipeListAncestor from '../../../models/RecipeListAncestor';
import RecipeListItem from './RecipeListItem';

export default class RecipeList extends RecipeListAncestor {
  constructor(private html: any[]) {
    super();
  }

  getFormatedList(): RecipeIndex {
    const formattedList = this.html.map((elementHTML: string) => {
      return new RecipeListItem(elementHTML);
    });

    const validFormattedList: RecipeIndex = formattedList
      .filter((item) => Boolean(item.Id))
      .map((item) => ({ id: item.Id, name: item.Name }));

    return validFormattedList;
  }
}
