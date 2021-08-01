import Recipe from "../../common/Recipe";

interface IRecipeCrawler {
  getDetail(value: string): Promise<Recipe | null>;
  getDetailById(id: number): Promise<Recipe | null>;
  getList(value: string): Promise<any>;
  isTranslationDependent(): boolean;
}

export default IRecipeCrawler;
