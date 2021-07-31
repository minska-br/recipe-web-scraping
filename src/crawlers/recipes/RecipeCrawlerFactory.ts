import Crawlers from "../../enumerators/crawlers";
import IRecipeCrawler from "./IRecipeCrawler";
import TudoGostosoCrawler from "./tudoGostoso/tudoGostosoCrawler";

export default class RecipeCrawlerFactory {
  public static createRecipeCrawler(crawlerName: Crawlers): IRecipeCrawler | null {
    switch (crawlerName) {
      case Crawlers.TudoGostoso:
        return new TudoGostosoCrawler();

      default:
        return null;
    }
  }
}
