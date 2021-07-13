/**
 * Model responsible for moving the crawled html on the sites.
 */
export default class CrawledRecipe {
  constructor(private name: string, private ingredients: string, private directions: string) {}

  get Name() {
    return this.name;
  }

  get Ingredients() {
    return this.ingredients;
  }

  get Directions() {
    return this.directions;
  }
}
