import puppeteer, { Browser, BrowserLaunchArgumentOptions, LaunchOptions } from "puppeteer";

type browserType = puppeteer.LaunchOptions &
  puppeteer.BrowserLaunchArgumentOptions &
  puppeteer.BrowserConnectOptions;

const chromiumDriverPath: string = process.env.CHROMIUM_DRIVER_PATH as string;

const defaultBrowserArgs: browserType = {
  executablePath: chromiumDriverPath ? chromiumDriverPath : undefined,
  headless: true,
  defaultViewport: null,
  timeout: 0,
  args: [
    "--disable-gpu",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
  ],
  userDataDir: './puppeteerCache'
};

interface IPuppeteerBrowserProps {
  headless?: boolean;
}

const getPuppeteerBrowser = async (props?: IPuppeteerBrowserProps): Promise<Browser> => {
  const headless = props?.headless ?? defaultBrowserArgs.headless;
  return await puppeteer.launch({ ...defaultBrowserArgs, headless });
};

export default getPuppeteerBrowser;
