import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";

import receiptUnits from "../../constants/receiptUnits";
import CrawledRecipe from "../../common/CrawledRecipe";
import Ingredient from "../../common/Ingredient";
import Recipe from "../../common/Recipe";
import removeTagsHTML from "../../utils/removeTagsHTML";
import replaceAll from "../../utils/replaceAll";
import toCapitalizedCase from "../../utils/toCapitalizedCase";
import RecipeListItem from "./model/RecipeList";
import RecipeList from "./model/RecipeList";

const selectors = {
  initialAlertCancelButton: "div > div > button:nth-child(1)",
  searchInput: "#search-query",
  resultList:
    "body > div.tdg-main > div.search-page.container > div:nth-child(2) > div.col-lg-5 > div > div.recipe-card",
  firstitemFromResultList:
    "body > div.tdg-main > div.search-page.container > div:nth-child(2) > div.col-lg-5 > div > div:nth-child(1) > a",
  name: "body > div.tdg-main > div.recipe-page > div > div.recipe-container.col-lg-12 > div:nth-child(1) > div > div.recipe-info.col-lg-8 > div.recipe-info-header > div.recipe-title > h1",
  ingredients: "#info-user > ul",
  steps:
    "body > div.tdg-main > div.recipe-page > div > div.recipe-container.col-lg-12 > div:nth-child(5) > div > div.directions-info.col-lg-8.directions-card > div.instructions.e-instructions > ol",
};

class TudoGostosoCrawler {
  private url = `https://www.tudogostoso.com.br`;
  private defaultBrowserArgs = {
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  };
  constructor(private browser: Browser | null = null) {}

  async getDetail(value = "test", hideCrawler = true): Promise<CrawledRecipe> {
    const delay = 1000;
    this.browser = await puppeteer.launch({ ...this.defaultBrowserArgs, headless: hideCrawler });

    try {
      const page = await this.browser.newPage();

      await page.goto(this.url);
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
      if (this.browser) this.browser.close();
    }
  }

  async getList(value = "test", hideCrawler = true) {
    const delay = 1000;
    this.browser = await puppeteer.launch({ ...this.defaultBrowserArgs, headless: hideCrawler });

    try {
      const page = await this.browser.newPage();

      await page.goto(this.url);
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

      await page.waitForSelector(selectors.resultList, { visible: true });

      const resultListHTML = await page.$$eval(selectors.resultList, (elements) =>
        elements.map((element: any) => element.innerHTML)
      );

      return resultListHTML;
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    } finally {
      if (this.browser) this.browser.close();
    }
  }
}

export default TudoGostosoCrawler;
