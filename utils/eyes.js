const {Eyes} = require('@applitools/eyes-images');
const {ConsoleLogHandler} = require('@applitools/eyes-common');

let eyes = null;

module.exports = (config) => {
  if (!eyes) {
    eyes = new Eyes();

    if (!config.applitools.apiKey) {
      throw new Error('apiKey in applitools config is missing');
    }

    eyes.setApiKey(config.applitools.apiKey);
    eyes.setHostOS(config.applitools.hostOS);
    eyes.setHostApp(config.applitools.hostApp);
    eyes.setServerUrl(config.applitools.serverUrl);
    eyes.setBatch(config.applitools.batchName, config.applitools.batchId);
    eyes.setLogHandler(new ConsoleLogHandler(false));
  }

  return eyes;
}

