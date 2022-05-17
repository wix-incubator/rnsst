export interface Config {
  port?: number; // Optional port to run storybook server on, default is 7007
  worker?: number;
  totalWorkers?: number;
  captureDirectory?: string;
}

export type StoryDefinition = {
  name: string;
  id: string;
};

export type StoryMap = Record<string, StoryDefinition>;

export type TestingLib = {
  testScreenshot: (id: string) => Promise<void>;
};
