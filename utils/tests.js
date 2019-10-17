const {Eyes} = require('@applitools/eyes-images');
const {ConsoleLogHandler} = require('@applitools/eyes-common');

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

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runTests(channel, stories, createReferenceFiles, {takeStoryScreenshot, getScreenshot, hasReferenceScreenshot, compareScreenshots, updateReference}, config) {
  let eyes = null;
  if (config.applitools) {
    eyes = new Eyes();

    if (!config.applitools.apiKey) {
      throw new Error('apiKey in applitools config is missing');
    }

    eyes.setApiKey(config.applitools.apiKey);
    eyes.setHostOS(config.applitools.hostOS);
    eyes.setHostApp(config.applitools.hostApp);
    eyes.setServerUrl(config.applitools.serverUrl);
    eyes.setBatch(config.applitools.batchName, config.applitools.batchId);
    eyes.setLogHandler(new ConsoleLogHandler(false));
  }

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
              await wait(500);
              await waitFor(element(by.id(id))).toBeVisible().withTimeout(2000);

              await takeStoryScreenshot(id);

              if (config.applitools) {
                await eyes.open(config.applitools.appName || 'APP_NAME', id);
                await eyes.checkImage(getScreenshot(id), id);

                await eyes.close();

                return;
              }

              if (!createReferenceFiles) {
                if (!hasReferenceScreenshot(id)) {
                  console.log(`New story added: ${id}. Make sure to include it with npx rnsst approve and add it to git!`);
                  this.skip();
                }

                const isEqual = await compareScreenshots(id);
                if (!isEqual) {
                  throw new Error('Screenshots do not match');
                }
              }
            });
          });
        });
      });

    after(async () => {
      if (!config.applitools && createReferenceFiles) {
        updateReference();
      }

      channel.stop();
    });
  });
}


module.exports = {
  loadTests,
  runTests
};
