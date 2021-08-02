import Recipe from '../../../common/models/Recipe';
import RecipeIndex from '../../../common/types/RecipeIndex';
import LanguageCode from '../../../enumerators/language-codes';

interface IRecipeCrawler {
  getDetail(value: string): Promise<Recipe | null>;
  getDetailById(id: number): Promise<Recipe | null>;
  getList(value: string): Promise<RecipeIndex | null>;
  getDefaultWebsiteLanguage(): LanguageCode;
}

export default IRecipeCrawler;
