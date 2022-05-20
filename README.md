# React Native Storybook Screenshot Testing

> This is a helper project which allows you to run screenshot tests for your React Native Storybook project.

## Prerequisites

This project depends on having detox and storybook running in your project.
You can read more about [Detox](https://github.com/wix/Detox) and about [Storybook](https://storybook.js.org/)

This project generates a directory with images from Storybook. Detecting changes in them is outside of scope for this module.

## Install

```sh
npm install rnsst
```

Then create storybook.spec.js file in your detox tests.

```js
const config = {
  port: 7007, // Optional port to run storybook server on, default is 7007
  runner: 'mocha' | 'jest', // Optional, default is mocha
  worker: 1, // Optional, leave empty if you are not using multiple Detox workers
  totalWorkers: 3, // Optional, leave empty if you are not using multiple Detox workers
  captureDirectory: './screenshots', // Optional, screenshots are left in Detox artifacts directory if not set
};

require('rnsst')(config, async () => {
  /* ...optional function to call before running screenshot tests, can be useful to navigate to storybook */
});
```

**Important: Storybook UI should be the only visible thing on the screen. Also make sure to hide status bar, so the clock does not break screenshot testing.**

Then simply run detox tests.

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
