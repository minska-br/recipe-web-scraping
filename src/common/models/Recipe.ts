import Direction from '../interfaces/Direction';
import Ingredient from '../interfaces/Ingredient';

export default class Recipe {
  constructor(
    private name?: string,
    private ingredients?: Ingredient[],
    private directions?: Direction[],
    private id?: number
  ) {}

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name ?? "";
  }

  public set Name(value: string) {
    this.name = value;
  }

  public get Ingredients() {
    return this.ingredients ?? [];
  }

  public set Ingredients(value: Ingredient[]) {
    this.ingredients = value;
  }

  public get Directions() {
    return this.directions ?? [];
  }

  public set Directions(value: Direction[]) {
    this.directions = value;
  }
}
