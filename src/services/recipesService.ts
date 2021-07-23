import Recipe from '../common/Recipe';
import RecipeDetail from '../crawlers/tudoGostoso/model/RecipeDetail';
import RecipeList from '../crawlers/tudoGostoso/model/RecipeList';
import TudoGostosoCrawler from '../crawlers/tudoGostoso/tudoGostosoCrawler';
import TranslatiosService from './translationsService';

class RecipesService {
  constructor(
    private tudoGostosoCrawler = new TudoGostosoCrawler(),
    private translatiosService = new TranslatiosService()
  ) {}

  async list(value = "test") {
    try {
      const recipesCrawled = await this.tudoGostosoCrawler.getList(value);

      const recipeListItem = new RecipeList(recipesCrawled);

      const formatedList = recipeListItem.getFormatedList();

      return formatedList;
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }

  async searchFirst(value = "test") {
    try {
      const recipeCrawled = await this.tudoGostosoCrawler.getDetail(value);
      if (!recipeCrawled) return null;
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }

  async searchById(id: number) {
    try {
      const recipeCrawled = await this.tudoGostosoCrawler.getDetailById(id);
      if (!recipeCrawled) return null;
      const recipeDetail = new RecipeDetail(recipeCrawled);
      const recipe = new Recipe(
        recipeDetail.Name,
        recipeDetail.Ingedients,
        recipeDetail.Directions
      );
      const translatedRecipe = await this.translatiosService.translateRecipe(recipe);
      return recipe;
    } catch (error) {
      console.error("[ERROR]: ", error);
      return null;
    }
  }
}

export default RecipesService;
