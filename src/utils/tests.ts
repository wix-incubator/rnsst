import {expect, element, by} from 'detox';
import {DetoxApplitoolsTesting} from 'detox-applitools-testing';
import Channel from './channel';
import {ScreenshotOptionsGetter, StoryMap} from '../types';

const IGNORE_PREFIX = '!';

export async function getStories(channel: Channel, beforeHandler?: () => void) {
  const [storyList] = await Promise.all([channel.getStoryList(), beforeHandler?.()]);
  return storyList;
}

export async function runTests(
  testingLib: DetoxApplitoolsTesting,
  channel: Channel,
  stories: StoryMap,
  getScreenshotOptions = getDefaultScreenshotOptions,
) {
  const storyGroups = Object.entries<any[]>(groupBy('kind', Object.values(stories)));
  for (const group of storyGroups) {
    const [kind, stories] = group;
    for (const story of stories) {
      const {name} = story;
      if (name[0] === IGNORE_PREFIX) {
        continue;
      }

      console.log(`Testing ${kind} - ${name}`);
      const {id} = story;

      await channel.setStory(id);
      await expect(element(by.id(id))).toBeVisible();
      await testingLib.testScreenshot(id, getScreenshotOptions(id));
    }
  }
}

function groupBy<T>(key: string, arr: T[]) {
  return arr.reduce((acc, cur) => {
    acc[cur[key]] = acc[cur[key]] || [];
    acc[cur[key]].push(cur);
    return acc;
  }, {});
}

const getDefaultScreenshotOptions: ScreenshotOptionsGetter = () => ({ignoredTopHeight: 0});
