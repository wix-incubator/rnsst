function loadTests(channel, beforeHandler) {
  return new Promise(async (resolve) => {
    channel.getStoryList(resolve);

    if (beforeHandler) {
      await beforeHandler();
    }
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function groupBy(key, arr) {
  return arr.reduce((acc, cur) => {
    acc[cur[key]] = acc[cur[key]] || [];

    acc[cur[key]].push(cur);
    return acc;
  }, {});
};

function runTests(channel, stories, createReferenceFiles, {takeStoryScreenshot, hasReferenceScreenshot, compareScreenshots, updateReference}) {
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

              channel.setStory(id);
              await wait(200);
              await takeStoryScreenshot(id);

              if (!createReferenceFiles) {
                if (!hasReferenceScreenshot(id)) {
                  console.log(`New story added: ${id}. Make sure to include it in reference files!`);
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
      if (createReferenceFiles) {
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
