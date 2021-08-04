import Crawlers from '../enumerators/crawlers';

export default function getCrawlerEnum(langCode: string): Crawlers | null {
  const crawlerValue = Object.values(Crawlers).find(
    (item) => item.toLowerCase() === langCode.toLowerCase()
  );

  return crawlerValue ? Crawlers[crawlerValue] : null;
}
