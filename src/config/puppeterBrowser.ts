import puppeteer, { Browser, BrowserLaunchArgumentOptions, LaunchOptions } from "puppeteer";

type browserType = puppeteer.LaunchOptions &
  puppeteer.BrowserLaunchArgumentOptions &
  puppeteer.BrowserConnectOptions;

const chromiumDriverPath: string = process.env.CHROMIUM_DRIVER_PATH as string;

const defaultBrowserArgs: browserType = {
  executablePath: chromiumDriverPath.length ? chromiumDriverPath : undefined,
  headless: false,
  defaultViewport: null,
  timeout: 0,
  args: [
    "--start-maximized",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--single-process",
  ],
};

interface IPuppeteerBrowserProps {
  headless?: boolean;
}

const getPuppeteerBrowser = async (props?: IPuppeteerBrowserProps): Promise<Browser> => {
  const headless = props?.headless ?? defaultBrowserArgs.headless;
  return await puppeteer.launch({ ...defaultBrowserArgs, headless });
};

export default getPuppeteerBrowser;
