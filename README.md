# Web Crawler API

API developed for web crawling using Node with Typescript.

## Environment
Example of how ```.env``` file should be structured:
```sh
PORT=4390
HOSTNAME=www.example.host.com
```

## TODO

### Main

  - [x] **Build the API core with Node and Typescript**
    - Example: An *is alive* endpoint returning success as true.
  - [x] Execute web scraping using some existing lib.
    - Recommended: 
      - **[Puppeteer](https://www.npmjs.com/package/puppeteer)**
      - [Selenium](https://www.npmjs.com/package/selenium-webdriver)
  - [x] **Search for recipes by title on a website**
    - Recommended: https://www.tudogostoso.com.br/
  - [ ] **Translate the recipe into English**


### Electives

- [ ] **Implement [Google Translate API](https://cloud.google.com/translate#section-6)**
  - [Cloud Translation documentation](https://cloud.google.com/translate/docs)
- [ ] **Reuse the same browser to optimize the runtime of translations, instead of opening a new one for each translation**