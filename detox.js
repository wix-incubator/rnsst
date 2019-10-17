const path = require('path');
const screenshotUtilsFactory = require('./utils/screenshots');

const config = require(path.resolve(process.cwd(), './rnsst-config.js'));

const screenshotUtils = screenshotUtilsFactory(config.screenshotPath);

module.exports = {
  setup: () => {
    screenshotUtils.makeScreenshotDir();
  },
  screenshot: async (id) => {
    eyes = require('./utils/eyes')(config);

    await screenshotUtils.takeStoryScreenshot(id);
    await eyes.open(config.applitools.appName || 'APP_NAME', id);
    await eyes.checkImage(screenshotUtils.getScreenshot(id), id);
    await eyes.close();
  }
};
