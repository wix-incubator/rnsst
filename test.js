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
        const arrayFromObject = Object.entries(stories).map(([key, value]) => ({
          [key]: value,
        }));
        const size = Math.floor(arrayFromObject.length / totalWorkers);
        const leftOvers = arrayFromObject.length % totalWorkers;
        const slicing = Array.from(
          Array(totalWorkers + 1).keys(),
          (i) => size * i + Math.min(leftOvers, i)
        );
        const workerChunk = arrayFromObject.slice(
          ...slicing.slice(worker - 1, worker + 1)
        );
        storiesChunk = workerChunk.reduce(
          (acc, cur) => ({ ...acc, ...cur }),
          {}
        );
      }

      setup(applitools);

      runTests(channel, storiesChunk, isJest, config.getScreenshotOptions);
    });

    it('Setup', () => {});
  });
};
