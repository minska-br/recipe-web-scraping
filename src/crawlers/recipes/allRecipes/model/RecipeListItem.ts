import { warn } from "../../../../config/Logger";
import NAMESPACES from "../../../../enumerators/namespaces";
import removeTagsHTML from "../../../../utils/removeTagsHTML";
import toCapitalizedCase from "../../../../utils/toCapitalizedCase";

export default class RecipeListItem {
  private id: number = 0;
  private name: string = "";
  private autor: string = "";
  private likes: number = 0;
  private preparation: string = "";
  private portions: number = 0;

  constructor(html: any[]) {
    html.forEach((elementInfo, idx) => {
      switch (idx) {
        case 1:
          this.setId(elementInfo);
          break;

        case 2:
          this.setNameAndAuthor(elementInfo);
          break;

        case 3:
          this.setLike(elementInfo);
          break;

        case 4:
          this.setPreparation(elementInfo);
          break;

        default:
          const info = { idx, elementInfo };
          const msg = "RecipeListItem - Recipe List Item info does not knowed";
          warn(NAMESPACES.TudoGostosoCrawler, msg, info);
      }
    });
  }

  private setId(info: string) {
    const infoItems = info.split(" ");
    const linkText = infoItems[1];
    const idText = linkText.substring(linkText.lastIndexOf("/") + 1, linkText.indexOf("-"));
    this.id = parseInt(idText);
  }

  public get Id(): number {
    return this.id;
  }

  private setNameAndAuthor(info: string) {
    const infoItems = info.split("</h3>");

    const [nameHTML, authorHTML] = infoItems;
    if (nameHTML) {
      this.name = removeTagsHTML(nameHTML);
    }

    if (authorHTML) {
      this.autor = removeTagsHTML(authorHTML.replace("Por", ""))
        .split(" ")
        .map((name) => {
          const notUppercaseItems = ["de", "da", "do", "del", "das", "dos"];
          const shouldBeCapitalized = !notUppercaseItems.includes(name);
          return shouldBeCapitalized ? toCapitalizedCase(name) : name;
        })
        .join(" ");
    }
  }

  public get Name(): string {
    return this.name;
  }

  public get Author(): string {
    return this.autor;
  }

  private setPreparation(info: string) {
    this.preparation = removeTagsHTML(info);
  }

  public get Preparation(): string {
    return this.preparation;
  }

  private setLike(info: string) {
    this.likes = parseInt(removeTagsHTML(info)) || 0;
  }

  public get Likes(): number {
    return this.likes;
  }
}