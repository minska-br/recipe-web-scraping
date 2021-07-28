export default class CrawledRecipeHTML {
  constructor(private name: string, private ingredients: string, private directions: string) {}

  get NameHTML() {
    return this.name;
  }

  get IngredientsHTML() {
    return this.ingredients;
  }

  get DirectionsHTML() {
    return this.directions;
  }
}
