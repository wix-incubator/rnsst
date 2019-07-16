const screenshotPath = process.env.STORYBOOK_SCREENSHOT_PATH;
const screenshots = require('../utils/screenshots');
screenshots(screenshotPath).updateReference();
