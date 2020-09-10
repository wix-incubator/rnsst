const {testScreenshot} = require('detox-applitools-testing');

function loadTests(channel, beforeHandler) {
  return Promise.all(
    [
      channel.getStoryList(),
      beforeHandler && beforeHandler()
    ].filter(x => x)
  ).then(([stories]) => stories);
}

function groupBy(key, arr) {
  return arr.reduce((acc, cur) => {
    acc[cur[key]] = acc[cur[key]] || [];

    acc[cur[key]].push(cur);
    return acc;
  }, {});
};

const defaultSettings = {ignoredTopHeight: 0};

function runTests(channel, stories, isJest, settings = defaultSettings) {
  const afterFunc = isJest ? afterAll : after

  describe('Comparing screenshots', () => {
    Object.entries(groupBy('kind', Object.values(stories)))
      .map(([kind, stories]) => {
        describe(kind, () => {
          stories.forEach((story) => {
            if (story.name[0] === '!') {
              return;
            }

            it(story.name, async function () {
              const {id} = story;

              await channel.setStory(id);

              await waitFor(element(by.id(id))).toBeVisible().withTimeout(2000);

              await testScreenshot(id, settings);
            });
          });
        });
      });

    afterFunc(async () => {
      channel.stop();
    });
  });
}


module.exports = {
  loadTests,
  runTests
};
