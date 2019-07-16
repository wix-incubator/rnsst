const Events = require('@storybook/core-events').default;
const createChannel = require('@storybook/channel-websocket').default;
const {Server} = require('./utils/websockets');

const createReferenceFiles = !!process.env.STORYBOOK_UPDATE_REFERENCE;
const screenshotPath = process.env.STORYBOOK_SCREENSHOT_PATH;

global.WebSocket = require('ws');

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = (beforeHandler) => {
  const {takeStoryScreenshot, makeScreenshotDir, compareScreenshots, updateReference} = require('./utils/screenshots')(screenshotPath);

  describe('Storybook', function () {
    before(async () => {
      //Start websocket server
      const server = new Server();

      //Create storybook channel
      const channel = createChannel({url: 'ws://localhost:7007'});

      return new Promise(async (resolve) => {

        //Wait till storybook sends us story list
        channel.emit(Events.GET_STORIES);
        channel.on(Events.SET_STORIES, ({stories}) => {
          resolve(stories);
        });

        makeScreenshotDir();

        if (beforeHandler) {
          await beforeHandler();
        }

      }).then((stories) => {
        describe('Comparing screenshots', () => {
          Object.values(stories).forEach((story) => {
            if (story.name[0] === '!') {
              return;
            }

            it(`${story.kind} ${story.name} (${story.id})`, async () => {
              const {id} = story;

              channel.emit(Events.SET_CURRENT_STORY, {storyId: id});
              await wait(500);
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
            server.wsServer.close();

            if (createReferenceFiles) {
              updateReference();
            }
          });
        });
      });
    });

    it('Setup', () => {});
  });
};


