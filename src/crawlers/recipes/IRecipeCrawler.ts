import Recipe from "../../common/Recipe";

interface IRecipeCrawler {
  getDetail(value: string): Promise<Recipe>;
  getDetailById(id: number): Promise<Recipe>;
  getList(value: string): Promise<any>;
  isTranslationDependent(): boolean;
}

export default IRecipeCrawler;
