import Recipe from '../../common/Recipe';
import LanguageCode from '../../enumerators/language-codes';

interface IRecipeCrawler {
  getDetail(value: string): Promise<Recipe | null>;
  getDetailById(id: number): Promise<Recipe | null>;
  getList(value: string): Promise<any>;
  getDefaultWebsiteLanguage(): LanguageCode;
}

export default IRecipeCrawler;
