const path = require('path');
const {spawn} = require('child_process');
const {mkdir, deleteFolderRecursive} = require('./helpers');

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

    getScreenshot: (name) => {
      return path.resolve(screenshotsPath, `./current/${name}.png`);
    }
  };
};

