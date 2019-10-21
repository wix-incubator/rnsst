const path = require('path');
const screenshotUtilsFactory = require('./utils/screenshots');

const config = require(path.resolve(process.cwd(), './rnsst-config.js'));

const screenshotUtils = screenshotUtilsFactory(config.screenshotPath);

module.exports = {
  setup: () => {
    screenshotUtils.makeScreenshotDir();
  },
  screenshot: async (id, options = {}) => {
    if (!config.applitools.apiKey) {
      return;
    }

    eyes = require('./utils/eyes')(config);

    await screenshotUtils.takeStoryScreenshot(id);
    await eyes.open(config.applitools.appName || 'APP_NAME', id);

    await eyes.checkRegion(screenshotUtils.getScreenshot(id), {
      left: 0,
      top: options.ignoreStatusBar !== false ? 44 : 0,
      width: 5000,
      height: 5000,
    }, id);

    await eyes.close();
  }
};
