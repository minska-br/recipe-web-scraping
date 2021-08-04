import LanguageCode from '../enumerators/language-codes';

/**
 * Functions that returns a LanguageCode enum value case it's a valid langCode, undefined
 *  if the langCode is not received andd null if it's a invalid langCode received.
 * @param langCode string that represents one LanguageCode enum value
 * @returns
 */
export default function getLanguageCodeEnum(langCode: string): LanguageCode | undefined | null {
  if (langCode === undefined) return undefined; // When user don't send langCode parameter

  const languageCode = Object.values(LanguageCode).find(
    (item) => item.toLowerCase() === langCode.toLowerCase()
  ) as LanguageCode;

  if (languageCode) {
    return LanguageCode[languageCode]; // Case the value received is a valid enum integrant
  } else {
    return null; // Case that the value receid it's not valid
  }
}
