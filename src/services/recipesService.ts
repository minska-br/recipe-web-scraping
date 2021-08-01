import Recipe from "../common/Recipe";
import { error, info } from "../config/Logger";
import RecipeCrawlerFactory from "../crawlers/recipes/RecipeCrawlerFactory";
import TudoGostosoCrawler from "../crawlers/recipes/tudoGostoso/tudoGostosoCrawler";
import Crawlers from "../enumerators/crawlers";
import NAMESPACES from "../enumerators/namespaces";
import TranslatiosService from "./translationsService";

class RecipesService {
  constructor(
    private tudoGostosoCrawler = new TudoGostosoCrawler(),
    private translatiosService = new TranslatiosService()
  ) {}

  async list(crawlerName: Crawlers, value = "test") {
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    try {
      return await recipeCrawler.getList(value);
    } catch (err) {
      error(NAMESPACES.RecipesService, "list", err);
      return null;
    }
  }

  async searchFirst(
    crawlerName: Crawlers,
    value = "test",
    targetLang = "en"
  ): Promise<Recipe | null> {
    let translatedRecipe: Recipe | null;
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);

    try {
      const crawledRecipe = await recipeCrawler.getDetail(value);
      info(NAMESPACES.RecipesService, "searchFirst - crawled recipe result", { crawledRecipe });

      if (!crawledRecipe) return null;

      if (recipeCrawler.isTranslationDependent()) {
        translatedRecipe = await this.translatiosService.translateRecipe(crawledRecipe, targetLang);
        info(NAMESPACES.RecipesService, "searchFirst - translated result", { translatedRecipe });
        return translatedRecipe || crawledRecipe;
      }

      return crawledRecipe;
    } catch (err) {
      error(NAMESPACES.RecipesService, "searchFirst", err);
      return null;
    }
  }

  async searchById(crawlerName: Crawlers, id: number): Promise<Recipe | null> {
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    info(NAMESPACES.RecipesService, "searchById - recipeCrawler", { recipeCrawler });

    try {
      const crawledRecipe = await recipeCrawler.getDetailById(id);
      info(NAMESPACES.RecipesService, "searchById - recipe web crawling result", { crawledRecipe });

      if (!crawledRecipe) return null;

      if (recipeCrawler.isTranslationDependent()) {
        const translatedRecipe = await this.translatiosService.translateRecipe(crawledRecipe);
        info(NAMESPACES.RecipesService, "searchById - translated result", { translatedRecipe });
        return translatedRecipe || crawledRecipe;
      }

      return crawledRecipe;
    } catch (err) {
      error(NAMESPACES.RecipesService, "searchById", err);
      return null;
    }
  }
}

export default RecipesService;
