import RecipeIndexItem from '../common/interfaces/RecipeIndexItem';
import Recipe from '../common/models/Recipe';
import { error, info } from '../config/Logger';
import RecipeCrawlerFactory from '../crawlers/recipes/factory/RecipeCrawlerFactory';
import Crawlers from '../enumerators/crawlers';
import LanguageCode from '../enumerators/language-codes';
import NAMESPACES from '../enumerators/namespaces';
import TranslatiosService from './translationsService';

class RecipesService {
  constructor(private translatiosService = new TranslatiosService()) {}

  async list(
    crawlerName: Crawlers,
    value = "test",
    sourceLang = LanguageCode.pt
  ): Promise<RecipeIndexItem[] | null> {
    const infoObj = { crawlerName, value, sourceLang };
    info(NAMESPACES.RecipesService, "list", infoObj);

    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);
    const websiteLang = recipeCrawler.getDefaultWebsiteLanguage();
    const isTranslationDependent = sourceLang !== websiteLang;

    try {
      const valueToSearch = await this.translatiosService.translate(value, websiteLang);
      const recipeIndex = await recipeCrawler.getList(value);

      if (recipeIndex && isTranslationDependent) {
        const translatedRecipeIndex = await this.translatiosService.translateRecipeIndex(
          recipeIndex,
          sourceLang
        );
        return translatedRecipeIndex || recipeIndex;
      }
      return recipeIndex;
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
    const infoObj = { crawlerName, value, targetLang };
    info(NAMESPACES.RecipesService, "searchFirst", infoObj);

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
    const infoObj = { id, targetLang, crawlerName };
    info(NAMESPACES.RecipesService, "searchById - recipeCrawler", infoObj);

    const recipeCrawler = RecipeCrawlerFactory.createRecipeCrawler(crawlerName);

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
