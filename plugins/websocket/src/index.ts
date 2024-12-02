import { definePlugin } from "@exptechtw/trem-kit";

enum Service {
  report = 'report',
  eew = 'eew',
}

export default definePlugin({
  name: "websocket",
  description: "WebSocket implementation for TREM-Lite",
  version: '1.0.0',
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
      choices: [Service.report, Service.eew],
    },
  },
  setup(app) {
    let ws: WebSocket | null;
    
    const destroy = () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    const connect = () => {
      destroy();
      ws = new WebSocket('wss://');
    }

    app.on('load', connect);
    app.on('unload', destroy);
  },
});