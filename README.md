# azure-pipelines-task-template

![Azure Pipelines](./images/azure-pipelines.png)

## Introduction

This repository contains a template to quick-start creation of a custom azure pipelines task written in TypeScript. It uses [webpack](https://webpack.js.org) to bundle scripts and [mocha](https://mochajs.org) to run tests.

## Get Started

There are a few small steps that need to be carried out before you can start using this template for your purpose-

- Create two guids and replace `{{guid_debug}}` and `{{guid_release}}` with these values in webpack [config](webpack.config.js). You can use [this](https://www.guidgenerator.com) tool to generate guids.

- Enter your publisher and author name in place of `{{publisher}}` and `{{author}}` strings. These files have references to these strings - [webpack config](webpack.config.js), [task.json](./src/custom-task/task.json) and [manifest.json](./src/manifest.json)

- Create a personal access token for the Azure Devops account where you would test-run your task. Refer [this](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops) to learn how to create a personal access token.

- Set following environment variables to enable inner loop commands-
    - `ADO_PAT` - Your personal access token
    - `ADO_COLLECTION_URI` - The default collection URI for your account *(eg. https://{{name}}.visualstudio.com/DefaultCollection)*
    - `ADO_ACCOUNT` - The name of your test Azure Devops account

## Why this template?

I spent more time than I'd like to admit for setting up a working base for my custom azure pipeline task. Being a new comer to the javascript world, I knew nothing about transpiling, bundling etc. and hence was lost in the sea of tools available. Eventually, I ended up with this setup which worked, even though I can't guarantee that it is the best possible. Any improvements are welcome. :smiley:
