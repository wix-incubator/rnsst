import {Config as ApplitoolsConfig, ScreenshotOptions} from 'detox-applitools-testing';

export interface Config {
  port?: number; // Optional port to run storybook server on, default is 7007
  worker?: number;
  totalWorkers?: number;
  applitools: ApplitoolsConfig;
  getScreenshotOptions?: ScreenshotOptionsGetter;
}

export type StoryMap = Record<string, any>;

export type ScreenshotOptionsGetter = (id?: string) => ScreenshotOptions;
