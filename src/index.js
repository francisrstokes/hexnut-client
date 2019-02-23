const WebSocket = require('ws');
const createContext = require('./ctx');

class HexNutClient {
  constructor(wsConfig = {}) {
    this.config = {
      ...wsConfig
    };
    this.client = null;
    this.middleware = [];
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  onError(err, ctx) {
    if (typeof this.onerror === 'function') {
      this.onerror(err, ctx);
    }
  }

  connect(remoteAddress) {
    this.client = new WebSocket(remoteAddress, this.config);
    const ctx = createContext(this, 'connection');

    this.client.on('open', () => this.runMiddleware(ctx));

    this.client.on('message', msg => {
      ctx.message = msg;
      ctx.type = 'message';
      this.runMiddleware(ctx);
    });

    this.client.on('close', () => {
      ctx.message = undefined;
      ctx.type = 'close';
      this.runMiddleware(ctx);
    });

    this.client.on('error', err => {
      this.onError(err, ctx);
    });
  }

  send(...args) {
    if (this.isReady()) {
      this.client.send(...args);
    }
    return this;
  }

  isReady() {
    return this.client && this.client.readyState === WebSocket.OPEN;
  }

  runMiddleware(ctx) {
    let i = 0;
    const run = async idx => {
      if (!ctx.isComplete && typeof this.middleware[idx] === 'function') {
        return await this.middleware[idx](ctx, () => run(idx+1));
      }
    };
    return run(i).catch(err => this.onError(err, ctx));
  }
};

module.exports = HexNutClient;