global.WebSocket = require('ws');

const Events = require('@storybook/core-events').default;
const createChannel = require('@storybook/channel-websocket').default;
const {Server} = require('./websockets');

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = function setupChannel(port) {
  //Start websocket server
  const server = new Server(port);

  let notifyStorySet = null;

  //Create storybook channel
  const channel = createChannel({url: `ws://localhost:${port}`});

  //should use STORY_RENDERED in future and remove the wait timeout
  channel.on(Events.SELECT_STORY, async () => {
    if (notifyStorySet) {
      await wait(500);
      notifyStorySet();
      notifyStorySet = null;
    }
  });

  return {
    stop() {
      server.wsServer.close();
    },

    getStoryList() {
      //Wait till storybook sends us story list
      channel.emit(Events.GET_STORIES);
      return new Promise((resolve) => {
        channel.on(Events.SET_STORIES, ({stories}) => {
          resolve(stories);
        });
      });
    },

    setStory(storyId) {
      return new Promise((resolve) => {
        notifyStorySet = resolve;

        channel.emit(Events.SET_CURRENT_STORY, {storyId});
      });
    }
  }
}
