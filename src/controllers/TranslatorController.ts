import { NextFunction, Request, Response } from "express";
import TranslatiosService from "../services/translationsService";

export default class TranslatorController {
  constructor(private translationsService?: TranslatiosService) {
    this.translationsService = new TranslatiosService();
  }

  translate = async (request: Request, response: Response, next: NextFunction) => {
    const { value } = request.query;

    if (!value) {
      return response.status(400).json({ message: "Value is required to translate." });
    }

    const result = await this.translationsService.translate(value as string);

    if (result) return response.json({ result });
    else return response.status(404).json({ message: "Recipe not found" });
  };

  translateMany = async (request: Request, response: Response, next: NextFunction) => {
    const { values } = request.body;

    if (!values) {
      return response.status(400).json({ message: "Values are required to translation." });
    }

    const result = await this.translationsService.translateMany(values as string[]);

    if (result) return response.json({ result });
    else return response.status(404).json({ message: "Recipe not found" });
  };
}
