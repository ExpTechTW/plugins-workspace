import { definePlugin } from '@exptechtw/trem-kit';

export default definePlugin({
  name: 'example',
  description: 'Example plugin for TREM-Lite',
  version: '1.0.0',
  author: [],
  settings: {
    key: {
      name: 'Toggle',
      description: 'A test toggle option',
      default: false,
    },
  },
  setup(app) {
    app.logger.info('example-plugin');

    app.on('DataRts', () => {
      app.logger.info('Hello world from example-plugin');
    });

    app.on('unload', () => {
      app.logger.info('Goodbye!');
    });
  },
});
