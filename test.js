const {setup} = require('detox-applitools-testing');

const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

const config = require(process.env.RNSST_CONFIG_PATH);

module.exports = (beforeHandler) => {
  const {port, applitools} = config;

  describe('Storybook', function () {
    before(async () => {
      const channel = setupChannel(port);
      const stories = await loadTests(channel, beforeHandler);

      setup(applitools);

      runTests(channel, stories);
    });

    it('Setup', () => {});
  });
};


