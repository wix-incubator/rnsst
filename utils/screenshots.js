const path = require('path');
const {spawn} = require('child_process');
const {mkdir, deleteFolderRecursive, getImageDiff} = require('./helpers');

module.exports = (screenshotsPath) => {
  return {
    makeScreenshotDir: () => {
      mkdir(screenshotsPath);
      mkdir(path.resolve(screenshotsPath, './reference'));
      const current = path.resolve(screenshotsPath, './current');
      deleteFolderRecursive(current);
      mkdir(current);

      const difference = path.resolve(screenshotsPath, './difference');
      deleteFolderRecursive(difference);
      mkdir(difference);
    },

    takeStoryScreenshot: (id) => {
      const screenshotFilePath = path.resolve(screenshotsPath, `./current/${id}.png`);

      const command = 'xcrun';
      const args = ['simctl', 'io', 'booted', 'screenshot', screenshotFilePath];
      return new Promise((resolve, reject) => {
        spawn(command, args).on('close', (code) => {
          if (code) {
            reject(new Error(`Command "${command} ${args.join(' ')}" exited with code ${code}`));
          }
          resolve(screenshotFilePath);
        });
      });
    },

    compareScreenshots: async (name) => {
      const current = path.resolve(screenshotsPath, `./current/${name}.png`);
      const reference = path.resolve(screenshotsPath, `./reference/${name}.png`);

      const diffPath = path.resolve(screenshotsPath, `./difference/${name}.png`);

      return await getImageDiff(reference, current, diffPath, 0);
    },

    updateReference: () => {
      const {deleteFolderRecursive, mkdir, copyFolderRecursiveSync} = require('./helpers');

      const reference = path.resolve(screenshotsPath, './reference');
      const current = path.resolve(screenshotsPath, './current');
      deleteFolderRecursive(reference);
      mkdir(reference);
      copyFolderRecursiveSync(current, reference);
    }
  };
};

