<h1 align="center">React Native Storybook Screenshot Testing</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-3.1.2-green.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wix/rnsst#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/wix/rnsst/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/wix/rnsst/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

> This is a helper project which allows you to run screenshot tests for your React Native Storybook project with Applitools.

## Prerequisites

This project depends on having detox and storybook running in your project.
You can read more about [Detox](https://github.com/wix/Detox) and about [Storybook](https://storybook.js.org/)

Also this project uses Detox Applitools testing as a dependency. You can check it [here](https://github.com/wix-incubator/detox-applitools-testing)

## Install

```sh
npm install rnsst
```

Then create storybook.spec.js file in your detox tests.

```js
const config = {
  port: 7007, // Optional port to run storybook server on, default is 7007
  runner: 'mocha' | 'jest', // Optional, default is mocha
  applitools: {
     apiKey: 'EYES_API_KEY', //Your key from applitools,
     appName: 'Your app Name',
     serverUrl: 'applitools server url', //Optional, leave empty if not using custom server
     batchId: 'Unique batch number, can simply be uuid.v4()',
     worker: 1, // Optional, leave empty if you are not using multiple Detox workers
     totalWorkers: 3, // Optional, leave empty if you are not using multiple Detox workers
  }
};

require('rnsst')(config, async () => {/* ...optional function to call before running screenshot tests, can be useful to navigate to storybook */});
```

**Important: Storybook UI should be the only visible thing on the screen. Also make sure to hide status bar, so the clock does not break screenshot testing.**

Then simply run detox tests.

## Usage

Whenever you do some changes you can run detox tests to compare reference screenshots to current screenshots.
After that you can check Applitools to see your changes.

## How does it work

This library works by setting up a websocket server and channel with your running storybook project. This way inside the tests we can retrieve story list and then run the tests on it.

## Tips

- You can use `!` as your first letter in story name to skip the story.
- If you are using mocha you can remove --bail option from mocha config to run all the tests
- Create a separate npm command to run only screenshot tests `detox test PATH_TO_storybook.spec.js`.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/wix/rnsst/issues).

## 📝 License

This project is [MIT](https://github.com/wix/rnsst/blob/master/LICENSE) licensed.
