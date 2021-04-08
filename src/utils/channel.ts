global.WebSocket = require('ws'); // TODO: is this still necessary?

import * as _ from 'lodash';
import Events from '@storybook/core-events';
import createChannel from '@storybook/channel-websocket';
import Server from './websockets';
import {StoryMap} from '../types';

export default class RnsstChannel {
  channel: any;
  server: Server;
  notifyStorySet: null | ((value?: unknown) => void) = null;

  constructor(port: number) {
    this.server = new Server(port);
    this.channel = createChannel({url: this.server.getUrl(), async: false, onError: _.noop});
    console.log(`Running Storybook server on ${this.server.getUrl()}`);

    this.channel.on(Events.STORY_RENDERED, this.onStoryRendered);
  }

  stop = () => {
    this.channel.removeAllListeners();
    this.server.stop();
  };

  onStoryRendered = () => {
    if (this.notifyStorySet) {
      this.notifyStorySet();
      this.notifyStorySet = null;
    }
  };

  getStoryList = (): Promise<StoryMap> => {
    console.log('Fetching stories');
    this.channel.emit(Events.GET_STORIES);
    return new Promise((resolve) => {
      // Wait till storybook sends us story list
      this.channel.on(Events.SET_STORIES, ({stories}: {stories: StoryMap}) => {
        console.log('Story list received');
        resolve(stories);
      });
    });
  };

  setStory = (storyId: string) => {
    return new Promise((resolve) => {
      this.notifyStorySet = resolve;
      this.channel.emit(Events.SET_CURRENT_STORY, {storyId});
    });
  };
}
