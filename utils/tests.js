
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

function runTests(channel, stories, createReferenceFiles, {takeStoryScreenshot, compareScreenshots, updateReference} ) {
  describe('Comparing screenshots', () => {
    Object.values(stories).forEach((story) => {
      if (story.name[0] === '!') {
        return;
      }

      it(`${story.kind} ${story.name} (${story.id})`, async () => {
        const {id} = story;

        channel.setStory(id);
        await wait(200);
        await takeStoryScreenshot(id);

        if (!createReferenceFiles) {
          const isEqual = await compareScreenshots(id);
          if (!isEqual) {
            throw new Error('Screenshots do not match');
          }
        }
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
