export default class RecipeListItem {
  private id: number = 0;
  private name: string = "";

  constructor(html: any) {
    const items = html.split("</div>");
    const mainSectionHTML = items[0].trim();
    this.setId(mainSectionHTML);
    this.setName(mainSectionHTML);
  }

  private setId(html: string) {
    const linkHTML = html.substring(html.indexOf("<a"), html.indexOf(">"));
    const hrefValue = linkHTML.substring(html.indexOf("href=") + 6, html.indexOf("title=") - 3);
    const id = hrefValue.substring(hrefValue.indexOf("recipe/") + 7).split("/")[0];
    this.id = parseInt(id);
  }

  public get Id(): number {
    return this.id;
  }

  private setName(html: string) {
    const name = html
      .trim()
      .substring(html.trim().indexOf("<h3") + 30, html.trim().indexOf("</h3>"))
      .trim();

    this.name = name;
  }

  public get Name(): string {
    return this.name;
  }
}
