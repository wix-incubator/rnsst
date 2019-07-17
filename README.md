<h1 align="center">React Native Storybook Screenshot Testing</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wix/rnsst#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/wix/rnsst/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/wix/rnsst/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/GytisVinclovas">
    <img alt="Twitter: GytisVinclovas" src="https://img.shields.io/twitter/follow/GytisVinclovas.svg?style=social" target="_blank" />
  </a>
</p>

> This is a helper project which allows you to run screeshot tests for your React Native Storybook project

### 🏠 [Homepage](https://github.com/wix/rnsst#readme)

## Prerequisites

This project depends on having detox with mocha and storybook running in your project.
You can read more about [Detox](https://github.com/wix/Detox) and about [Storybook](https://storybook.js.org/)

## Install

```sh
npm install rnsst
```

To set-up  first create `./rnsst-config.js` file.

```js
const path = require('path');
module.exports = {
  screenshotPath: path.resolve(__dirname, './screenshots'), //path where you want your screenshots
  testPath: path.resolve(__dirname, './e2e/storybook.spec.js'), //path where your spec file exists 
  port: 6006 // Optional port to run storybook server on, default is 7007
};
```

Then create storybook.spec.js file in your detox tests.

```js
require('rnsst')(async () => {/* ...optional function to call before running screenshot tests */});
```

Finally for the first time run `npx rnsst create-reference`.

## Usage

Whenever you do some changes you can run `npx rnsst test` to compare reference screenshots to current screeshots.

You can the run `npx rnsst results` to open html file with all screenshots (differences, current, reference).

If you want to confirm your changes run `npx rnsst approve`.

## How does it work

This library works by setting up a websocket server and channel with your running storybook project. This way inside the tests we can retrieve story list and then run the tests on it.

## Tips

- You can use `!` as your first letter in story name to skip the story.
- You can pass custom detox arguments as `--detox-args`

## Author

👤 **Gytis Vinclovas**

* Twitter: [@GytisVinclovas](https://twitter.com/GytisVinclovas)
* Github: [@gongreg](https://github.com/gongreg)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/wix/rnsst/issues).

## 📝 License

This project is [MIT](https://github.com/wix/rnsst/blob/master/LICENSE) licensed.
