import puppeteer, { Browser, BrowserLaunchArgumentOptions, LaunchOptions } from "puppeteer";

type browserType = puppeteer.LaunchOptions &
  puppeteer.BrowserLaunchArgumentOptions &
  puppeteer.BrowserConnectOptions;

const chromiumDriverPath: string = process.env.CHROMIUM_DRIVER_PATH as string;

const defaultBrowserArgs: browserType = {
  executablePath: chromiumDriverPath.length ? chromiumDriverPath : undefined,
  headless: true,
  defaultViewport: null,
  args: [
    "--start-maximized",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--single-process",
  ],
};

const getPuppeteerBrowser = async (
  headless = defaultBrowserArgs.headless
): Promise<Browser | null> => {
  return await puppeteer.launch({ ...defaultBrowserArgs, headless });
};

export default getPuppeteerBrowser;
