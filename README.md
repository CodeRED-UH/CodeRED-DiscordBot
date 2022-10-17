![CR-Astronaut-200](https://user-images.githubusercontent.com/44646589/173269384-4cf87e8d-83b1-4d0d-b867-568d4781fb2d.png)

# CodeRED Discord Bot 🤖

CodeRED is a **24 hours hackathon**, organized by CougarCS, the largest computer science organization at the University of Houston. It's an event for people to come together and innovate by pushing their limits to create something amazing!

This is the offical CodeRED Discord Bot. The bot is built using Typescript and DiscordJS.

<hr/>

![CircleCI](https://img.shields.io/circleci/build/github/CodeRED-UH/CodeRED-DiscordBot?style=flat-square)
[![GitHub issues](https://img.shields.io/github/issues/CodeRED-UH/CodeRED-DiscordBot?style=flat-square)](https://github.com/CodeRED-UH/CodeRED-DiscordBot/issues)
![GitHub last commit](https://img.shields.io/github/last-commit/CodeRED-UH/CodeRED-DiscordBot?style=flat-square)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/CodeRED-UH/CodeRED-DiscordBot/discord.js?style=flat-square)

# Development 🔨

- #### Requirements
  - [NodeJS](https://nodejs.org/en/) Version 16+
  - [Yarn](https://yarnpkg.com/)
- #### Installation
  1. `Yarn` to install packages
  2. Create an `.env` in the root (./) directory
     - You must have a [Discord Developer](https://discord.com/developers) account setup to obtain a bot token.
     - Developer mode must be enabled in your Discord Client to obtain your Guild and Client IDs.
     - Contents of the `.env` file:
  ```
  TOKEN = <Discord_Bot_Token>
  GUILD_ID = <Guild_ID>
  CLIENT_ID = <Owner_ID>
  ```
  3. You're good to go!
- #### Build Scripts
  - `Yarn start` : Runs the code normally using ts-node.
  - `Yarn dev` : Starts the ts-node-dev watcher and recompiles + runs code whenever a change is made.
  - `Yarn build` : Compiles .TS files to .JS using TSC and puts them in ./dist
  - `Yarn clean` : Compiles .TS files cleanly and wipes all existing .JS files
- #### Linting/Styling
  - This repo uses ESLint and Prettier to enforce linting and styling rules.
  - `Yarn lint` : Checks for any linting issues
  - `Yarn lint:fix` : Attempts to fix any autofixable linting issues
  - `Yarn prettier` : Checks for any styling issues
  - `Yarn prettier:fix` : Attempts to format all code to match style rules
  - We suggest using an ESLint and Prettier plugin for your respective editor to aid with development.
- #### Structure
  - `index.ts` contains handler routing and login
  - `./commands` contains individual commands
  - `./configs` contains data storage/configuation
  - `./events` contains handlers for different events
  - `./interfaces` contains interfaces
  - `./utils` contains utility files

<hr/>

# Deployment 🚀

- To deploy you'll first need to run `Yarn build` which builds the .JS files in ./dist
- Secondly you'll need to navigate into `./dist` and run `node index.js`

<hr/>

# Contributing 🧩

- #### Ideas
  - We want everyone to be able to help us in any way they can! Every idea is welcome, please [open an issue](https://github.com/CodeRED-UH/CodeRED-DiscordBot/issues/new?assignees=&labels=enhancement&template=feature-request--.md&title=) describing what you have in mind first. We'll discuss your idea and we may add it to the bot! Feel free to also leave your thoughts on current [ideas](https://github.com/CodeRED-UH/CodeRED-DiscordBot/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement).
- #### Bugs
  - Found a bug? Please let us know! Don't hesitate to [write a bug report](https://github.com/CodeRED-UH/CodeRED-DiscordBot/issues/new?assignees=&labels=bug&template=bug-report---.md&title=) with as much information as possible!
  - Are you the exterminator type? Feel free to check out an existing [bug report](https://github.com/CodeRED-UH/CodeRED-DiscordBot/issues?q=is%3Aissue+is%3Aopen+label%3A%22type%3A+bug%22+) and see if you can find anything new and tell us what you've found.
