import * as _ from 'lodash';
import {DetoxApplitoolsTesting, TestReporter} from 'detox-applitools-testing';
import Channel from './utils/channel';
import {getStories, runTests} from './utils/tests';
import {Config, StoryMap} from './types';

const DEFAULT_PORT = 7007;

export const testStories = async (config: Config, beforeHandler?: () => void, reporter?: TestReporter) => {
  const {port, applitools, worker, totalWorkers} = config;

  const channel = new Channel(port || DEFAULT_PORT);
  const stories = await getStories(channel, beforeHandler);
  const storiesChunk = splitStoriesToChunks(stories, worker, totalWorkers);

  const testingLib = new DetoxApplitoolsTesting({...applitools, reportFailuresAfterAll: true}, reporter);
  testingLib.setup();

  await runTests(testingLib, channel, storiesChunk, config.getScreenshotOptions);

  channel.stop();
  await testingLib.close();
};

function splitStoriesToChunks(stories: StoryMap, worker?: number, totalWorkers?: number) {
  if (!worker || !totalWorkers) {
    return stories;
  }

  const storiesLength = Object.keys(stories).length;
  const chunkSize = Math.ceil(storiesLength / totalWorkers);
  const arrayFromObject = Object.entries(stories).map(([key, value]) => ({
    [key]: value,
  }));
  const storiesByChunk = _.chunk(arrayFromObject, chunkSize);
  const storiesChunk = storiesByChunk[worker - 1].reduce((acc, cur) => ({...acc, ...cur}), {});

  return storiesChunk;
}
