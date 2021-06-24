const createContext = require('./ctx');

class HexNutClient {
  constructor(wsConfig = {}, WebsocketClientImpl = null) {
    this.config = {
      ...wsConfig
    };
    this.client = null;
    this.middleware = [];

    this.WebsocketClientImpl = WebsocketClientImpl
      ? WebsocketClientImpl
      : Websocket;
    console.log(this.WebsocketClientImpl);
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
    this.client = new this.WebsocketClientImpl(remoteAddress);
    const ctx = createContext(this, 'connection');

    this.client.onopen = () => this.runMiddleware(ctx);
    this.client.onerror = err => this.onError(err, ctx);

    this.client.onmessage = msg => {
      ctx.message = msg.data;
      ctx.type = 'message';
      this.runMiddleware(ctx);
    };

    this.client.onclose = () => {
      ctx.message = undefined;
      ctx.type = 'close';
      this.runMiddleware(ctx);
    };
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