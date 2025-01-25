import { definePlugin } from '@exptechtw/trem-kit';

enum Service {
  TremRts = 'trem.rts',
  TremEew = 'trem.eew',
  TremIntensity = 'trem.intensity',
  Eew = 'websocket.eew',
  Report = 'websocket.report',
  Intensity = 'cwa.intensity',
}

export default definePlugin({
  name: 'websocket',
  description: 'WebSocket implementation for TREM-Lite',
  version: '1.0.0',
  author: [],
  settings: {
    key: {
      name: '金鑰',
      description: 'WebSocket 連線金鑰',
      default: '',
    },
    service: {
      name: '服務',
      description: 'WebSocket 連線服務列表',
      default: [],
      choices: [Service.TremEew, Service.TremIntensity, Service.TremRts, Service.Eew, Service.Intensity, Service.Report],
    },
  },
  setup(app) {
    let ws: WebSocket | null = null;
    let url: string | null = null;

    const destroy = () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    };

    const connect = () => {
      destroy();
      url = `wss://lb-${Math.ceil(Math.random() * 4).toString()}.exptech.dev`;
      ws = new WebSocket(url);
    };

    app.on('load', connect);
    app.on('unload', destroy);
  },
});
