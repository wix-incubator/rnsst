import Channel from './utils/channel';
import {getStories, runTests} from './utils/tests';
import {Config, StoryMap, TestingLib} from './types';
import fs = require('fs');
import path = require('path');

const DEFAULT_PORT = 7007;

export const testStories = async (config: Config, beforeHandler?: () => void) => {
  const {port, worker, totalWorkers} = config;

  const channel = new Channel(port || DEFAULT_PORT);
  const stories = await getStories(channel, beforeHandler);
  const storiesChunk = splitStoriesToChunks(stories, worker, totalWorkers);

  const testingLib: TestingLib = {
    testScreenshot: async (id: string) => {
      console.log('Handling ' + id);
      const file = await device.takeScreenshot(id);
      console.log('Saved to ' + file);
      if (config.captureDirectory) {
        const targetDir = path.resolve(process.cwd(), config.captureDirectory);
        fs.mkdirSync(targetDir, {recursive: true});
        const savedFile = path.join(targetDir, `${id}.png`);
        fs.copyFile(file, savedFile, (err) => {
          console.log(err ? `Failed to copy output of ${id}: ` + err : 'Copied to ' + savedFile);
        });
      }
    },
  };

  await runTests(testingLib, channel, storiesChunk);

  channel.stop();
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
