import Crawlers from '../../enumerators/crawlers';
import AllRecipesCrawler from './allRecipes/allRecipesCrawler';
import IRecipeCrawler from './IRecipeCrawler';
import TudoGostosoCrawler from './tudoGostoso/tudoGostosoCrawler';

export default class RecipeCrawlerFactory {
  public static createRecipeCrawler(crawlerName: Crawlers): IRecipeCrawler {
    switch (crawlerName) {
      case Crawlers.TudoGostoso:
        return new TudoGostosoCrawler();

      case Crawlers.AllRecipes:
        return new AllRecipesCrawler();

      default:
        throw new Error(`Crawler name "${crawlerName}" not recognized.`);
    }
  }
}
