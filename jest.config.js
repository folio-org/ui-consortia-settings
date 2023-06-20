const path = require('path');
const stripesConfig = module.exports = require('@folio/jest-config-stripes');
const acqConfig = module.exports = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...stripesConfig,
  setupFiles: [
    ...stripesConfig.setupFiles,
    ...acqConfig.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
};
