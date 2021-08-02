import Recipe from '../common/Recipe';
import { error, info } from '../config/Logger';
import RecipeCrawlerFactory from '../crawlers/recipes/RecipeCrawlerFactory';
import Crawlers from '../enumerators/crawlers';
import LanguageCode from '../enumerators/language-codes';
import NAMESPACES from '../enumerators/namespaces';
import TranslatiosService from './translationsService';

class RecipesService {
  constructor(private translatiosService = new TranslatiosService()) {}

  async list(crawlerName: Crawlers, value = "test") {
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    const websiteLang = recipeCrawler.getDefaultWebsiteLanguage();

    try {
      const valueToSearch = await this.translatiosService.translate(value, websiteLang);
      return await recipeCrawler.getList(valueToSearch ?? value);
    } catch (err) {
      error(NAMESPACES.RecipesService, "list", err);
      return null;
    }
  }

  async searchFirst(
    crawlerName: Crawlers,
    value = "test",
    targetLang = LanguageCode.en
  ): Promise<Recipe | null> {
    let translatedRecipe: Recipe | null;
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    const websiteLang = recipeCrawler.getDefaultWebsiteLanguage();
    const isTranslationDependent = websiteLang !== targetLang;

    try {
      const valueToSearch = await this.translatiosService.translate(value, websiteLang);
      const crawledRecipe = await recipeCrawler.getDetail(valueToSearch ?? value);
      info(NAMESPACES.RecipesService, "searchFirst - crawled recipe result", { crawledRecipe });

      if (!crawledRecipe) return null;

      if (isTranslationDependent) {
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

  async searchById(
    crawlerName: Crawlers,
    id: number,
    targetLang = LanguageCode.en
  ): Promise<Recipe | null> {
    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    const infoObj = { id, targetLang, recipeCrawler };
    info(NAMESPACES.RecipesService, "searchById - recipeCrawler", infoObj);

    try {
      const crawledRecipe = await recipeCrawler.getDetailById(id);
      info(NAMESPACES.RecipesService, "searchById - recipe web crawling result", { crawledRecipe });

      if (!crawledRecipe) return null;

      if (recipeCrawler.getDefaultWebsiteLanguage() !== targetLang) {
        const translatedRecipe = await this.translatiosService.translateRecipe(
          crawledRecipe,
          targetLang
        );
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
