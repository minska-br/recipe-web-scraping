import Crawlers from '../../../enumerators/crawlers';
import IRecipeCrawler from '../interfaces/IRecipeCrawler';
import AllRecipesCrawler from '../websites/allRecipes/allRecipesCrawler';
import TudoGostosoCrawler from '../websites/tudoGostoso/tudoGostosoCrawler';

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
