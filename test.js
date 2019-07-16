
const screenshotUtilsFactory = require('./utils/screenshots');
const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

const createReferenceFiles = !!process.env.STORYBOOK_UPDATE_REFERENCE;
const screenshotPath = process.env.STORYBOOK_SCREENSHOT_PATH;

module.exports = (beforeHandler) => {
  const screenshotUtils = screenshotUtilsFactory(screenshotPath);

  describe('Storybook', function () {
    before(async () => {
      screenshotUtils.makeScreenshotDir();

      const channel = setupChannel();
      const stories = await loadTests(channel, beforeHandler);

      runTests(channel, stories, createReferenceFiles, screenshotUtils);
    });
  });

  it('Setup', () => {});
};


