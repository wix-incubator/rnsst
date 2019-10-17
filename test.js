const screenshotUtilsFactory = require('./utils/screenshots');
const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

const config = require(process.env.RNSST_CONFIG_PATH);

module.exports = (beforeHandler) => {
  const {screenshotPath, port} = config;

  const screenshotUtils = screenshotUtilsFactory(screenshotPath);

  describe('Storybook', function () {
    before(async () => {
      screenshotUtils.makeScreenshotDir();

      const channel = setupChannel(port);
      const stories = await loadTests(channel, beforeHandler);

      runTests(channel, stories, screenshotUtils, config);
    });

    it('Setup', () => {});
  });
};


