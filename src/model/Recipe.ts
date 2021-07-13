import Direction from './Direction';
import Ingredient from './Ingredient';

export default class Recipe {
  id?: string;

  constructor(
    private name: String,
    private ingredients: Ingredient[],
    private directions: Direction[]
  ) {}

  getJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      ingredients: this.ingredients,
      directions: this.directions,
    });
  }
}
