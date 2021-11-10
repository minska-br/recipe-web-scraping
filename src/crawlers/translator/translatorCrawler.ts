import puppeteer, { Browser } from "puppeteer";
import { Cluster } from "puppeteer-cluster";

import { error } from "../../config/Logger";
import getPuppeteerBrowser from "../../config/puppeterBrowser";
import LanguageCode from "../../enumerators/language-codes";
import NAMESPACES from "../../enumerators/namespaces";

const selectors = {
  resultElement:
    "body > c-wiz > div > div:nth-child(2) > c-wiz > div:nth-child(2) > c-wiz > div > div:nth-child(2) > div:nth-child(2) > c-wiz:nth-child(2) > div:nth-child(6) > div > div > span",
  buttonCopyResult:
    "body > c-wiz > div > div:nth-child(2) > c-wiz > div:nth-child(2) > c-wiz > div > div:nth-child(2) > div:nth-child(2) > c-wiz:nth-child(2) > div:nth-child(6) > div > div:nth-child(4) > div:nth-child(2) > div > span > button",
};

class TranslatorCrawler {
  private defaultLang = LanguageCode.en;
  private sourceLang = "auto";
  private targetLang = this.defaultLang;

  constructor(private browser: Browser | null = null) {}

  public set TargetLang(value: LanguageCode) {
    this.targetLang = value;
  }

  async translate(value = "test", hideCrawler = false) {
    const url =
      `https://translate.google.com/?` +
      `sl=${this.sourceLang}&` +
      `tl=${this.targetLang}&` +
      `op=translate&text=${value}`;

    try {
      this.browser = await getPuppeteerBrowser({ headless: hideCrawler });

      const page = await this.browser.newPage();
      const pageContext = await page.browserContext();
      await pageContext.overridePermissions(url, ["clipboard-write", "clipboard-read"]);

      await page.goto(url);
      await page.waitForSelector(selectors.resultElement);
      await page.click(selectors.buttonCopyResult);
      await page.focus(selectors.buttonCopyResult);
      await page.keyboard.press("Enter");
      const translationResult = await page.evaluate(() => navigator.clipboard.readText());

      return translationResult;
    } catch (err) {
      error(NAMESPACES.TranslatorCrawler, "translate", err);
      return "unknow";
    } finally {
      if (this.browser) {
        this.browser.disconnect();
        this.browser.close();
      }
    }
  }

  async translateMany(values: string[], hideCrawler = true) {
    let cluster: Cluster<any, any> | undefined;
    let results = {};
    const addResult = (value: string, translation: string) => {
      const isKnowedValue = Object.keys(results).includes(value);

      if (!isKnowedValue) {
        results = { ...results, [value]: translation };
      }
    };

    try {
      cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
      });

      await cluster.task(async ({ page, data: { value, addResult } }) => {
        const url =
          `https://translate.google.com/?` +
          `sl=${this.sourceLang}&` +
          `tl=${this.targetLang}&` +
          `op=translate&text=${value}`;

        await page.goto(url);
        const pageContext = await page.browserContext();
        await pageContext.overridePermissions(url, ["clipboard-write", "clipboard-read"]);

        await page.goto(url);
        await page.waitForSelector(selectors.resultElement);
        await page.$eval(selectors.resultElement, (element) => element.innerHTML);

        await page.focus(selectors.buttonCopyResult);
        await page.keyboard.press("Enter");
        const translationResult = await page.evaluate(() => navigator.clipboard.readText());

        addResult(value, translationResult);
      });

      values.forEach((value) => cluster?.queue({ value, addResult }));
    } catch (err) {
      error(NAMESPACES.TranslatorCrawler, "translate", err);
      return null;
    } finally {
      if (cluster) {
        await cluster.idle();
        await cluster.close();
      }

      return results;
    }
  }
}

export default TranslatorCrawler;
