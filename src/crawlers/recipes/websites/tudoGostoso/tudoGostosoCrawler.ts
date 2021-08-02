import puppeteer, { Browser } from 'puppeteer';

import Recipe from '../../../../common/models/Recipe';
import RecipeIndex from '../../../../common/types/RecipeIndex';
import { error, info } from '../../../../config/Logger';
import LanguageCode from '../../../../enumerators/language-codes';
import NAMESPACES from '../../../../enumerators/namespaces';
import truncateText from '../../../../utils/truncateText';
import IRecipeCrawler from '../../interfaces/IRecipeCrawler';
import CrawledRecipeHTML from '../../models/CrawledRecipeHTML';
import RecipeDetail from './model/RecipeDetail';
import RecipeList from './model/RecipeList';

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

class TudoGostosoCrawler implements IRecipeCrawler {
  private url = `https://www.tudogostoso.com.br`;
  private defaultBrowserArgs = {
    headless: false,
    waitUntil: "networkidle",
    defaultViewport: null,
    args: ["--start-maximized"],
  };
  constructor(private browser: Browser | null = null, private hideCrawler = false) {}

  getDefaultWebsiteLanguage = () => LanguageCode.pt;

  async getDetail(value = "test"): Promise<Recipe | null> {
    const initInfo = "getDetail - [WORKER] ";
    this.browser = await puppeteer.launch({
      ...this.defaultBrowserArgs,
      headless: this.hideCrawler,
    });

    try {
      const page = await this.browser.newPage();

      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Going to: ${this.url}`);
      await page.goto(this.url, { waitUntil: "load" });
      await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));

      const hasInitialAlertCancelButtonHTML = await page.evaluate((selector) => {
        const initialAlertCancelButtonElement = document.querySelector(selector);
        return Boolean(initialAlertCancelButtonElement);
      }, selectors.initialAlertCancelButton);
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Check initial alert`, {
        hasInitialAlertCancelButtonHTML,
      });

      if (hasInitialAlertCancelButtonHTML) {
        await page.waitForSelector(selectors.initialAlertCancelButton, {
          visible: !this.hideCrawler,
        });
        await page.focus(selectors.initialAlertCancelButton);
        await page.keyboard.press("Enter");
        info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Close initial alert`);
      }

      await page.waitForSelector(selectors.searchInput);
      await page.focus(selectors.searchInput);
      await page.keyboard.type(value);
      await page.keyboard.press("Enter");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Type "${value}" in search input`);

      await page.waitForSelector(selectors.firstitemFromResultList);
      await page.focus(selectors.firstitemFromResultList);
      await page.keyboard.press("Enter");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Search value pressing Enter`);

      await page.waitForSelector(selectors.name);
      const nameHTML = await page.$eval(selectors.name, (element) => element.innerHTML);
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract name`, { nameHTML });

      const ingredientsHTML = await page.$eval(
        selectors.ingredients,
        (element) => element.innerHTML
      );
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract ingredients`, { ingredientsHTML });

      const directionsHTML = await page.$eval(selectors.steps, (element) => element.innerHTML);
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract directions`, { directionsHTML });

      const recipeCrawled = new CrawledRecipeHTML(nameHTML, ingredientsHTML, directionsHTML);
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (err) {
      error(NAMESPACES.TudoGostosoCrawler, "getDetail", err);
      return null;
    } finally {
      if (this.browser) this.browser.close();
    }
  }

  async getDetailById(id: number): Promise<Recipe | null> {
    const initInfo = "getDetailById - [WORKER] ";
    const specificRecipeId = `${this.url}/receita/${id}`;

    this.browser = await puppeteer.launch({
      ...this.defaultBrowserArgs,
      headless: this.hideCrawler,
    });

    try {
      const page = await this.browser.newPage();
      await page.setDefaultNavigationTimeout(0);

      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Going to: ${specificRecipeId}`);
      await page.goto(specificRecipeId, { waitUntil: "load" });
      await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));

      await page.waitForSelector(selectors.name);
      const nameHTML = await page.$eval(selectors.name, (element) => element.innerHTML);
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract name`, { nameHTML });

      await page.waitForSelector(selectors.ingredients);
      const ingredientsHTML = await page.$eval(
        selectors.ingredients,
        (element) => element.innerHTML
      );
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract ingredients`, { ingredientsHTML });

      await page.waitForSelector(selectors.ingredients);
      const directionsHTML = await page.$eval(selectors.steps, (element) => element.innerHTML);
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract directions`, { directionsHTML });

      const recipeCrawled = new CrawledRecipeHTML(nameHTML, ingredientsHTML, directionsHTML);
      const recipeDetail = new RecipeDetail(recipeCrawled);
      return new Recipe(recipeDetail.Name, recipeDetail.Ingedients, recipeDetail.Directions);
    } catch (err) {
      error(NAMESPACES.TudoGostosoCrawler, "getDetailById", err);
      return null;
    } finally {
      if (this.browser) this.browser.close();
    }
  }

  async getList(value = "test"): Promise<RecipeIndex | null> {
    const initInfo = "getList - [WORKER] ";
    this.browser = await puppeteer.launch({
      ...this.defaultBrowserArgs,
      headless: this.hideCrawler,
    });

    try {
      const page = await this.browser.newPage();

      await page.goto(this.url, { waitUntil: "load" });

      const hasInitialAlertCancelButtonHTML = await page.evaluate((selector) => {
        const initialAlertCancelButtonElement = document.querySelector(selector);
        return Boolean(initialAlertCancelButtonElement);
      }, selectors.initialAlertCancelButton);

      if (hasInitialAlertCancelButtonHTML) {
        await page.waitForSelector(selectors.initialAlertCancelButton);
        await page.focus(selectors.initialAlertCancelButton);
        await page.keyboard.press("Enter");
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Close initial alert`);
      }

      await page.waitForSelector(selectors.searchInput, { visible: true });
      await page.focus(selectors.searchInput);
      await page.keyboard.type(value);
      await page.keyboard.press("Enter");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Type "${value}" in search input`);

      await page.waitForSelector(selectors.resultList, { visible: true });
      const resultListHTML = await page.$$eval(selectors.resultList, (elements) =>
        elements.map((element: any) => element.innerHTML)
      );
      const infoResultList = { resultListHTML: truncateText(resultListHTML[0]) };
      info(NAMESPACES.TudoGostosoCrawler, `${initInfo}Extract result list`, infoResultList);

      const recipeListItem = new RecipeList(resultListHTML);
      const formatedList = recipeListItem.getFormatedList();
      return formatedList;
    } catch (err) {
      error(NAMESPACES.TudoGostosoCrawler, "getList", err);
      return null;
    } finally {
      if (this.browser) this.browser.close();
    }
  }
}

export default TudoGostosoCrawler;
