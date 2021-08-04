# Web Crawler API
> API developed for web crawling using Node with Typescript..

<p align="center">
  <a href="#installation-and-requirements">Installation and Requirements</a> • 
  <a href="#how-to-run">How to run</a> •  
  <a href="#api-documentation">Api documentation</a> • 
  <a href="#architecture">Architecture</a> • 
  <a href="#license">License</a>
</p>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

## Requirements

- [Node >= 12.18.3](https://nodejs.org/en/download/)
- [npm >= 6.14.6](https://nodejs.org/en/download/)


## Instalation

To install all dependencies just run the following command:
```sh
npm install
```


## How to run

After install step we have three options related with the running process:

### Development mode
This case should be used during the development, after each save files command will restart the project server with the new code. 
```
npm run start:dev
```

### Stage mode
Out of the development process people can test the requests and analise the logs without the necessity to change files.


```
npm run start
```

_Obs: On this way, changing and saving files doesn't restart the server_

### Production mode
Running mode for production environment, this script will remove the ```/build``` directory and creates a new one with all the transpiled files.

```
npm run start:prod
```


## Api documentation

This project has all its endpoints documented in **Postman** as a **shared collection**, to get a copy of its endpoints, just click the link below:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/63e2a73e2608f30ff156)


## Architecture

**_TODO_**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center"><b>Thanks and good tests 🎉</b></p>
<p align="center">
  <img width="100" height="100" alt="bye" src="https://media.giphy.com/media/JO3FKwP5Fwx44uMfDI/giphy.gif">
</p>


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
  - [x] **Dispose recipes list enpoint after an search**
  - [ ] **Translate the recipe into English**


### Electives

- [ ] **Implement [Google Translate API](https://cloud.google.com/translate#section-6)**
  - [Cloud Translation documentation](https://cloud.google.com/translate/docs)
- [ ] **Reuse the same browser to optimize the runtime of translations, instead of opening a new one for each translation**