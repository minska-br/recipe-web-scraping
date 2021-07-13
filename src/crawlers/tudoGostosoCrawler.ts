import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";

import receiptUnits from "../constants/receiptUnits";
import CrawledRecipe from "../model/CrawledRecipe";
import Ingredient from "../model/Ingredient";
import Recipe from "../model/Recipe";
import removeTagsHTML from "../utils/removeTagsHTML";
import replaceAll from "../utils/replaceAll";
import toCapitalizedCase from "../utils/toCapitalizedCase";

const selectors = {
  initialAlertCancelButton: "div > div > button:nth-child(1)",
  searchInput: "#search-query",
  firstitemFromResultList:
    "body > div.tdg-main > div.search-page.container > div:nth-child(2) > div.col-lg-5 > div > div:nth-child(1) > a",
  name: "body > div.tdg-main > div.recipe-page > div > div.recipe-container.col-lg-12 > div:nth-child(1) > div > div.recipe-info.col-lg-8 > div.recipe-info-header > div.recipe-title > h1",
  ingredients: "#info-user > ul",
  steps:
    "body > div.tdg-main > div.recipe-page > div > div.recipe-container.col-lg-12 > div:nth-child(5) > div > div.directions-info.col-lg-8.directions-card > div.instructions.e-instructions > ol",
};

class TudoGostosoCrawler {
  async search(value = "test", hideCrawler = true): Promise<CrawledRecipe> {
    let browser: Browser | null = null;
    const url = `https://www.tudogostoso.com.br`;
    const delay = 1000;

    try {
      browser = await puppeteer.launch({
        headless: hideCrawler,
        defaultViewport: null,
        args: ["--start-maximized"],
      });

      const page = await browser.newPage();

      await page.goto(url);
      await page.waitForTimeout(delay);

      const hasInitialAlertCancelButtonHTML = await page.evaluate((selector) => {
        const initialAlertCancelButtonElement = document.querySelector(selector);
        return Boolean(initialAlertCancelButtonElement);
      }, selectors.initialAlertCancelButton);

      if (hasInitialAlertCancelButtonHTML) {
        await page.waitForSelector(selectors.initialAlertCancelButton);
        await page.focus(selectors.initialAlertCancelButton);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(delay);
      }

      await page.waitForSelector(selectors.searchInput, { visible: true });
      await page.focus(selectors.searchInput);
      await page.keyboard.type(value);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(delay);

      await page.waitForSelector(selectors.firstitemFromResultList, { visible: true });
      await page.focus(selectors.firstitemFromResultList);
      await page.keyboard.press("Enter");

      await page.waitForSelector(selectors.ingredients, { visible: true });

      const nameHTML = await page.$eval(selectors.name, (element) => element.innerHTML);

      const ingredientsHTML = await page.$eval(
        selectors.ingredients,
        (element) => element.innerHTML
      );

      const directionsHTML = await page.$eval(selectors.steps, (element) => element.innerHTML);

      return new CrawledRecipe(nameHTML, ingredientsHTML, directionsHTML);
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    } finally {
      if (browser) browser.close();
    }
  }
}

export default TudoGostosoCrawler;
