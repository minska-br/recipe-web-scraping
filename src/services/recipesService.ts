import Recipe from "../common/Recipe";
import { error } from "../config/logger";
import RecipeDetail from "../crawlers/tudoGostoso/model/RecipeDetail";
import RecipeList from "../crawlers/tudoGostoso/model/RecipeList";
import TudoGostosoCrawler from "../crawlers/tudoGostoso/tudoGostosoCrawler";
import NAMESPACES from "../enumerators/namespaces";
import TranslatiosService from "./translationsService";

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
    } catch (err) {
      error(NAMESPACES.RecipesService, "list", err);
      return null;
    }
  }

  async searchFirst(value = "test") {
    try {
      const recipeCrawled = await this.tudoGostosoCrawler.getDetail(value);
      if (!recipeCrawled) return null;
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (err) {
      error(NAMESPACES.RecipesService, "searchFirst", err);
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
    } catch (err) {
      error(NAMESPACES.RecipesService, "searchById", err);
      return null;
    }
  }
}

export default RecipesService;
