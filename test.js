const {setup} = require('detox-applitools-testing');

const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

module.exports = (config, beforeHandler) => {
  const {port, applitools, runner = 'mocha'} = config;
  const isJest = runner === 'jest'
  const beforeFunc = isJest ? beforeAll : before

  describe('Storybook', function () {
    beforeFunc(async () => {
      const channel = setupChannel(port || 7007);
      const stories = await loadTests(channel, beforeHandler);

      setup(applitools);

      runTests(channel, stories, isJest);
    });

    it('Setup', () => {});
  });
};
