import { definePlugin } from '@exptechtw/trem-kit';

export default definePlugin({
  name: 'example',
  description: 'Example plugin for TREM-Lite',
  version: '1.0.0',
  settings: {
    key: {
      name: 'Toggle',
      description: 'A test toggle option',
      default: false,
    },
  },
  setup(app) {
    app.on('load', () => {
      app.logger.info('Hello world from example-plugin');
    });

    app.on('unload', () => {
      app.logger.info('Goodbye!');
    });
  },
});
