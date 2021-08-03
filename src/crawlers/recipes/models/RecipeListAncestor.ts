import RecipeIndex from '../../../common/types/RecipeIndex';

abstract class RecipeListAncestor {
  abstract getFormatedList(): RecipeIndex;
}

export default RecipeListAncestor;
