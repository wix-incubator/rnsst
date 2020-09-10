const _ = require('lodash');
const {setup} = require('detox-applitools-testing');

const setupChannel = require('./utils/channel');
const {loadTests, runTests} = require('./utils/tests');

module.exports = (config, beforeHandler) => {
  const {port, applitools, runner = 'mocha', worker, totalWorkers} = config;
  const isJest = runner === 'jest';
  const beforeFunc = isJest ? beforeAll : before;

  describe('Storybook', function () {
    beforeFunc(async () => {
      const channel = setupChannel(port || 7007);
      const stories = await loadTests(channel, beforeHandler);

      let storiesChunk = stories;
      if (worker && totalWorkers) {
        const storiesLength = Object.keys(stories).length;
        const chunkSize = Math.ceil(storiesLength / totalWorkers);
        const arrayFromObject = Object.entries(stories).map(([key, value]) => ({
          [key]: value,
        }));
        const storiesByChunk = _.chunk(arrayFromObject, chunkSize);
        storiesChunk = storiesByChunk[worker - 1].reduce(
          (acc, cur) => ({...acc, ...cur}),
          {}
        );
      }

      setup(applitools);

      runTests(channel, storiesChunk, isJest, config.detoxApplitoolsSettings);
    });

    it('Setup', () => {});
  });
};
