const screenshotUtilsFactory = require('./utils/screenshots');
const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

function getArguments() {
  return {
    createReferenceFiles: !!process.env.STORYBOOK_UPDATE_REFERENCE,
    screenshotPath: process.env.STORYBOOK_SCREENSHOT_PATH,
    port: process.env.STORYBOOK_PORT
  };
}

module.exports = (beforeHandler) => {
  const {createReferenceFiles, screenshotPath, port} = getArguments();

  const screenshotUtils = screenshotUtilsFactory(screenshotPath);

  describe('Storybook', function () {
    before(async () => {
      screenshotUtils.makeScreenshotDir();

      const channel = setupChannel(port);
      const stories = await loadTests(channel, beforeHandler);

      runTests(channel, stories, createReferenceFiles, screenshotUtils);
    });

    it('Setup', () => {});
  });
};


