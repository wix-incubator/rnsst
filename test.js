const {setup} = require('detox-applitools-testing');

const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

module.exports = (config, beforeHandler) => {
  const {port, applitools} = config;

  describe('Storybook', function () {
    before(async () => {
      const channel = setupChannel(port || 7007);
      const stories = await loadTests(channel, beforeHandler);

      setup(applitools);

      runTests(channel, stories);
    });

    it('Setup', () => {});
  });
};
