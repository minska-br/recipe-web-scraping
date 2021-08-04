# Web Crawler API
> API developed for web crawling using Node with Typescript.

<p align="center">
  <a href="#requirements">Requirements</a> • 
  <a href="#environment">Environment</a> •  
  <a href="#instalation">Instalation</a> •  
  <a href="#how-to-run">How to run</a> •  
  <a href="#api-documentation">Api documentation</a>
</p>

## Getting Started

These instructions will allow you to install and run the web scrapping api, at [Api documentation](#api-documentation) you can run see more about the endpoints.

## Requirements

- [Node >= 12.18.3](https://nodejs.org/en/download/)
- [npm >= 6.14.6](https://nodejs.org/en/download/)

## Environment
Example of how ```.env``` file should be structured:
```sh
PORT=4390
HOSTNAME=www.example.host.com
```

## Instalation

To install all dependencies just run the following command:
```sh
npm install
```


## How to run

After install step we have three options related with the running process:

### Development mode
This case should be used during development time, after each command to save files the project server will restart with the new code.

```
npm run start:dev
```

### Stage mode
Outside of the development process, this mode is meant for people who want to test requests and analyze logs without having to change files.


```
npm run start
```

_Obs: This way, changing and saving the files will not restart the server with the latest updates. To do this, restart the server manually or use development mode._

### Production mode
This is the execution mode aimed at the production environment, it will generate a set of optimized files so that the server doesn't suffer from impaired memory performance.

```
npm run start:prod
```

This script will remove the ```/build``` directory and creates a new one with all the transpiled files.

## Api documentation

This project has all its endpoints documented in **Postman** as a **shared collection**, to get a copy of its endpoints:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/63e2a73e2608f30ff156)


---
<p align="center"><b>Thanks and good tests 🎉</b></p>
<p align="center">
  <img width="100" height="100" alt="bye" src="https://media.giphy.com/media/JO3FKwP5Fwx44uMfDI/giphy.gif">
</p>
