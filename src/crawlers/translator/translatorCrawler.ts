import puppeteer, { Browser } from "puppeteer";

const selectors = {
  resultElement:
    "body > c-wiz > div > div:nth-child(2) > c-wiz > div:nth-child(2) > c-wiz > div > div:nth-child(2) > div:nth-child(2) > c-wiz:nth-child(2) > div:nth-child(6) > div > div > span",
  buttonCopyResult:
    "body > c-wiz > div > div:nth-child(2) > c-wiz > div:nth-child(2) > c-wiz > div > div:nth-child(2) > div:nth-child(2) > c-wiz:nth-child(2) > div:nth-child(6) > div > div:nth-child(4) > div:nth-child(2) > div > span > button",
};

class TranslatorCrawler {
  private defaultLang = "en";
  constructor(private browser: Browser | null = null, private delay = 1000) {}

  async translate(
    value = "test",
    targetLang = this.defaultLang,
    sourceLang = "auto",
    hideCrawler = true
  ) {
    const url = `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&op=translate&text=${value}`;

    try {
      this.browser = await puppeteer.launch({
        headless: hideCrawler,
        defaultViewport: null,
        args: ["--start-maximized"],
      });

      const page = await this.browser.newPage();
      const pageContext = await page.browserContext();
      await pageContext.overridePermissions(url, ["clipboard-write", "clipboard-read"]);

      await page.goto(url);
      await page.waitForSelector(selectors.resultElement);
      await page.waitForTimeout(this.delay);
      await page.$eval(selectors.resultElement, (element) => element.innerHTML);

      await page.focus(selectors.buttonCopyResult);
      await page.keyboard.press("Enter");
      const translationResult = await page.evaluate(() => navigator.clipboard.readText());

      return translationResult;
    } catch (error) {
      console.error(">>> Error: ", error);
      return "unknow";
    } finally {
      if (this.browser) this.browser.close();
    }
  }
}

export default TranslatorCrawler;
