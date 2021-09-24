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

  const arrayFromObject = Object.entries(stories).map(([key, value]) => ({
    [key]: value,
  }));

  const size = Math.floor(arrayFromObject.length / totalWorkers);
  const leftOvers = arrayFromObject.length % totalWorkers;
  const getChunkStart = (index: number) => size * index + Math.min(leftOvers, index);
  const workerChunk = arrayFromObject.slice(getChunkStart(worker - 1), getChunkStart(worker));

  const storiesChunk = workerChunk.reduce((acc, cur) => ({...acc, ...cur}), {});

  return storiesChunk;
}
