const createContext = require('./ctx');

class HexNutClient {
  constructor(wsConfig = {}, WebsocketClientImpl = null) {
    this.config = {
      ...wsConfig
    };
    this.client = null;
    this.middleware = [];
    this.runSequencer = Promise.resolve();

    this.WebsocketClientImpl = WebsocketClientImpl
      ? WebsocketClientImpl
      : WebSocket;
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

    this.client.onopen = () => {
      this.runSequencer = this.runSequencer.then(() => this.runMiddleware(ctx));
    }

    this.client.onerror = err => this.onError(err, ctx);

    this.client.onmessage = msg => {
      this.runSequencer = this.runSequencer.then(() => {
        ctx.message = msg.data;
        ctx.type = 'message';
        return this.runMiddleware(ctx);
      });
    };

    this.client.onclose = () => {
      this.runSequencer = this.runSequencer.then(() => {
        ctx.message = null;
        ctx.type = 'closing';
        return this.runMiddleware(ctx);
      });
    };
  }

  close() {
    this.client.close();
  }

  send(...args) {
    if (this.isReady()) {
      this.client.send(...args);
    }
    return this;
  }

  isReady() {
    return this.client && this.client.readyState === this.WebsocketClientImpl.OPEN;
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
