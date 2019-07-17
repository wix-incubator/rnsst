global.WebSocket = require('ws');

const Events = require('@storybook/core-events').default;
const createChannel = require('@storybook/channel-websocket').default;
const {Server} = require('./websockets');

module.exports = function setupChannel(port) {
  //Start websocket server
  const server = new Server(port);

  //Create storybook channel
  const channel = createChannel({url: `ws://localhost:${port}`});

  return {
    stop() {
      server.wsServer.close();
    },

    getStoryList(callback) {
      //Wait till storybook sends us story list
      channel.emit(Events.GET_STORIES);
      channel.on(Events.SET_STORIES, ({stories}) => {
        callback(stories);
      });
    },

    setStory(storyId) {
      channel.emit(Events.SET_CURRENT_STORY, {storyId});
    }
  }
}
