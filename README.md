# azure-pipelines-task-template

![Azure Pipelines](./images/azure-pipelines.png)

## Introduction

This repository contains a quick start template for creating and publishning a custom azure pipelines task written in TypeScript. It uses [webpack](https://webpack.js.org) to bundle scripts and is configured to use [jest](https://jestjs.io/) to run tests.

## Getting started

There are a few small steps that need to be carried out before you can start using this template for your purpose-

1. Create two guids and replace `{{guid_production}}` and `{{guid_development}}` occurences with these values in webpack [config](webpack.config.js). You can use [this](https://www.guidgenerator.com) tool to generate guids. *(It helps to have different guids for different environments as it allows you to install multiple extension flavors in the same account)*

1. Enter your publisher and author name in place of `{{publisher}}` and `{{author}}` strings. These files have references to these strings - [webpack config](webpack.config.js), [task.json](./src/custom-task/task.json) and [manifest.json](./src/manifest.json)

1. Create a personal access token for the Azure Devops account where you would test run your task. Refer [this](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops) to learn how to create a personal access token.

1. Set following environment variables to enable inner loop commands-
    - `BUILD_ENV` = **development**
    - `ADO_PAT` - Your personal access token
    - `ADO_ACCOUNT_URI` - The default collection URI for your account *(eg. <https://dev.azure.com/{{name}})>*
    - `DEV_PUBLISHER` - Id of your publisher account

1. Run following commands to verify setup-
    1. `npm install` (Installs npm dependencies)
    1. `npm run dev` (Builds, packages and publishes the extension)

1. Refer to [package.json](./package.json) to see the list of all commands.

## Typical inner loop commands

| What changed? | Which NPM command to run? | What it does? |
| ------------- |:-------------:|:----- |
| Task implementation | `npm run dev:task` | Build, package and update policy task without updating extension |
| Anything else | `npm run dev` | Build, package and publish full extension |
