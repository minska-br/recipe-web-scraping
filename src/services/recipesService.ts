import receiptUnits from "../constants/receiptUnits";
import TudoGostosoCrawler from "../crawlers/tudoGostosoCrawler";
import Direction from "../model/Direction";
import Ingredient from "../model/Ingredient";
import Recipe from "../model/Recipe";
import removeTagsHTML from "../utils/removeTagsHTML";
import replaceAll from "../utils/replaceAll";
import toCapitalizedCase from "../utils/toCapitalizedCase";

class RecipesService {
  constructor(private tudoGostosoCrawler = new TudoGostosoCrawler()) {}

  async getDetail(value = "test", hideCrawler = true) {
    const romovables = ["\n"];
    const orderedRecipeUnits = receiptUnits.sort((a, b) => b.length - a.length);

    try {
      const recipeCrawled = await this.tudoGostosoCrawler.getDetail(value, hideCrawler);

      if (!recipeCrawled) return null;

      let name = replaceAll(recipeCrawled.Name, romovables, "");
      name = removeTagsHTML(name).trim();

      let ingredients = await Promise.all(
        recipeCrawled.Ingredients.toString()
          .split('<li><span class="p-ingredient" tabindex="0" itemprop="recipeIngredient">')
          .filter((item) => Boolean(item))
          .map((item) => removeTagsHTML(item).trim())
      );
      const ingredientsObj: Ingredient[] = ingredients.map((item) => {
        const whitespaceBetweenWords = " ";
        const itemWords = item.toLowerCase().split(whitespaceBetweenWords);
        const firstItemText = itemWords[0];
        const hasAmountNumber = !isNaN(Number(firstItemText)) || firstItemText.includes("/");

        if (hasAmountNumber) {
          const [amountText, ...nameText] = itemWords;
          const wholeNameText = nameText.join(whitespaceBetweenWords);

          for (let len = wholeNameText.length; len > 0; len--) {
            /**
             * Analisa se o texto sem o número é uma unidade de receita mas diminuindo o texto restante
             * de trás para frente até restar apenas uma letra.
             * Mesmo que sobre uma letra ela pode ser uma unidade de medida (Ex: g - gramas, l - litros...)
             * porém temos que garantir que não se trata de uma letra dentro de uma palavra (Ex: o l pode ser litro mas se for encontrada no inicio da palavra "l"ata não é válido, ela deve estár isolada).
             *
             */
            const nameTextInit = wholeNameText.substring(0, len);
            const isReceiptUnit = orderedRecipeUnits.includes(nameTextInit);

            const isNotLetterOfOneWord = itemWords.some((word) => {
              const hasNameTextInit = word.includes(nameTextInit);
              const hasSameLenght = word.length == nameTextInit.length;
              return hasNameTextInit && hasSameLenght;
            });

            if (isReceiptUnit && isNotLetterOfOneWord) {
              console.log("\n>>> Here: ", {
                wholeNameText,
                nameTextInit,
                isReceiptUnit,
                isNotLetterOfOneWord,
                orderedRecipeUnit: orderedRecipeUnits.find((x) => x.includes(nameTextInit)),
              });
              const nameTextFinal = wholeNameText.substring(len, wholeNameText.length).trim();
              return {
                amount: `${amountText.trim()} ${nameTextInit}`,
                name: toCapitalizedCase(nameTextFinal.replace("de ", "")).trim(),
              };
            }
          }
          return { amount: amountText.trim(), name: toCapitalizedCase(wholeNameText) };
        }

        // if (hasAmountNumber) {
        //   const receiptUnitUsed = orderedRecipeUnits.find((unit) => {
        //     const isIncludedInItem = item.includes(unit);
        //     const hasSameLenght = item.length === unit.length;

        //     return isIncludedInItem && hasSameLenght;
        //   });
        //   const [amountText, ...nameText] = item.split(receiptUnitUsed);
        //   // const amount = `${amountText.trim()} ${receiptUnitUsed.trim()}`.trim();
        //   const amount = receiptUnitUsed
        //     ? `${amountText.trim()} ${receiptUnitUsed}`
        //     : amountText.trim();
        //   const igredientName = nameText.join(whitespaceBetweenWords).replace("de ", "").trim();

        //   return { amount, name: toCapitalizedCase(igredientName) };
        // }

        return { amount: "indefinido", name: toCapitalizedCase(item) };
      });

      const directions: Direction[] = recipeCrawled.Directions.split('<li><span tabindex="0">')
        .filter((items) => Boolean(items))
        .map((item) => removeTagsHTML(item).trim())
        .map((item, index) => {
          return { step: index + 1, name: toCapitalizedCase(item) };
        });

      return new Recipe(name, ingredientsObj, directions);
    } catch (error) {
      console.error(">>> Error: ", error);
      return null;
    }
  }
}

export default RecipesService;
