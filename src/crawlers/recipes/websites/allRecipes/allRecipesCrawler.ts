import { Browser } from "puppeteer";

import Recipe from "../../../../common/models/Recipe";
import RecipeIndex from "../../../../common/types/RecipeIndex";
import { error, info } from "../../../../config/Logger";
import getPuppeteerBrowser from "../../../../config/puppeterBrowser";
import LanguageCode from "../../../../enumerators/language-codes";
import NAMESPACES from "../../../../enumerators/namespaces";
import truncateText from "../../../../utils/truncateText";
import IRecipeCrawler from "../../interfaces/IRecipeCrawler";
import CrawledRecipeHTML from "../../models/CrawledRecipeHTML";
import RecipeDetail from "./model/RecipeDetail";
import RecipeList from "./model/RecipeList";

const selectors = {
  searchInput: "indefinido",
  resultList: ".card__detailsContainer-left",
  firstitemFromResultList:
    "body > main > div.search-results-content > div > div.search-results-content-results-wrapper > div:nth-child(3) > div.card__imageContainer > a",
  name: "body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.main-header.recipe-main-header > div.intro.article-info > div > h1",
  ingredients:
    "#ar-calvera-app > section.component.recipe-ingredients.container.interactive > fieldset > ul",
  directions:
    "body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.two-col-content-wrapper > div.recipe-content-container > section.recipe-instructions.recipe-instructions.component.container > fieldset > ul",
};

class AllRecipesCrawler implements IRecipeCrawler {
  private url = `https://www.allrecipes.com`;
  private defaultBrowserArgs = {
    headless: false,
    waitUntil: "networkidle",
    defaultViewport: null,
    args: ["--start-maximized"],
  };
  constructor(private browser: Browser | null = null, private hideCrawler = false) {}

  getDefaultWebsiteLanguage = () => LanguageCode.en;

  async getDetail(value = "test"): Promise<Recipe | null> {
    const initInfo = "getDetail - [WORKER] ";
    const specificRecipeUrl = `${this.url}/search/results/?search=${value}`;

    this.browser = await getPuppeteerBrowser({ headless: true });

    try {
      const page = await this.browser.newPage();
      await page.setDefaultNavigationTimeout(0);

      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Going to: ${specificRecipeUrl}`);
      // await page.goto(specificRecipeUrl, { waitUntil: "load" });

      const link = await page.evaluate((selector) => {
        return document.querySelector(selector).href;
      }, selectors.firstitemFromResultList);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Find first details of ${value} at ${link}`);

      await page.evaluate(() => window.scrollBy(0, window.outerHeight / 2));

      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Going to: ${link}`);

      await page.evaluate(() => window.scrollBy(0, window.outerHeight / 2));

      const name = await page.evaluate((selector) => {
        return document.querySelector(selector).innerText;
      }, selectors.name);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract name`, { name });

      const ingredientsHTML = await page.evaluate((selector) => {
        return document.querySelector(selector).innerHTML;
      }, selectors.ingredients);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract ingredients`, { ingredientsHTML });

      const directionsHTML = await page.evaluate((selector) => {
        return document.querySelector(selector).innerHTML;
      }, selectors.directions);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract directions`, { directionsHTML });

      const recipeCrawled = new CrawledRecipeHTML(name, ingredientsHTML, directionsHTML);
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (err) {
      error(NAMESPACES.AllRecipesCrawler, "getDetail", err);
      return null;
    } finally {
      if (this.browser) await this.browser.close();
    }
  }

  async getDetailById(id: number): Promise<Recipe | null> {
    const initInfo = "getDetailById - [WORKER] ";
    const specificRecipeId = `${this.url}/recipe/${id}`;

    this.browser = await getPuppeteerBrowser();

    try {
      const page = await this.browser.newPage();
      await page.setDefaultNavigationTimeout(0);

      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Going to: ${specificRecipeId}`);
      await page.goto(specificRecipeId, { waitUntil: "load", timeout: 0 });

      const name = await page.evaluate((selector) => {
        return document.querySelector(selector).innerText;
      }, selectors.name);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract name`, { name });

      const ingredientsHTML = await page.evaluate((selector) => {
        return document.querySelector(selector).innerHTML;
      }, selectors.ingredients);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract ingredients`, { ingredientsHTML });

      const directionsHTML = await page.evaluate((selector) => {
        return document.querySelector(selector).innerHTML;
      }, selectors.directions);
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract directions`, { directionsHTML });

      const recipeCrawled = new CrawledRecipeHTML(name, ingredientsHTML, directionsHTML);
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (err) {
      error(NAMESPACES.AllRecipesCrawler, "getDetailById", err);
      return null;
    } finally {
      if (this.browser) await this.browser.close();
    }
  }

  async getList(value = "test"): Promise<RecipeIndex | null> {
    const initInfo = "getList - [WORKER] ";
    const specificRecipeSearchUrl = `${this.url}/search/results/?search=${value}`;

    this.browser = await getPuppeteerBrowser();

    try {
      const page = await this.browser.newPage();
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Going to: ${specificRecipeSearchUrl}`);
      await page.setDefaultTimeout(0);
      await page.setDefaultNavigationTimeout(0);

      await page.goto(specificRecipeSearchUrl, { waitUntil: "load", timeout: 0 });

      const resultListHTML = await page.$$eval(selectors.resultList, (elements) =>
        elements.map((element: any) => element.innerHTML)
      );
      const infoObj = {
        count: resultListHTML.length,
        resultListHTML: truncateText(resultListHTML[0]),
      };
      info(NAMESPACES.AllRecipesCrawler, `${initInfo}Extract result list`, infoObj);

      const recipeListItem = new RecipeList(resultListHTML);
      const formatedList: RecipeIndex = recipeListItem.getFormatedList();
      return formatedList;
    } catch (err) {
      error(NAMESPACES.AllRecipesCrawler, "getList", err);
      return null;
    } finally {
      if (this.browser) await this.browser.close();
    }
  }
}

export default AllRecipesCrawler;
