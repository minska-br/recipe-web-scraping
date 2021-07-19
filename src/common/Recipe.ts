import Direction from "./Direction";
import Ingredient from "./Ingredient";

export default class Recipe {
  constructor(
    private name: String,
    private ingredients: Ingredient[],
    private directions: Direction[],
    private id?: number
  ) {}

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name;
  }

  public get Ingredients() {
    return this.ingredients;
  }

  public get Directions() {
    return this.directions;
  }
}
