import TranslatorCrawler from "../crawlers/translator/translatorCrawler";

class TranslatiosService {
  constructor(private translatorCrawler = new TranslatorCrawler()) {}

  async translate(value: string) {
    try {
      const translationResult = await this.translatorCrawler.translate(value);
      return translationResult;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }

  async translateMany(values: string[], targetLang: string = "en") {
    try {
      const result = await this.translatorCrawler.translateMany(values);

      return result;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }
}

export default TranslatiosService;
