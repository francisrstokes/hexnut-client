const ctx = {
  send(...args) {
    this.client.send(...args);
  },

  get isConnection() {
    return this.type === 'connection';
  },

  get isMessage() {
    return this.type === 'message';
  },

  get isClosing() {
    return this.type === 'closing';
  }
};

module.exports = (client, type, message) => Object.assign(Object.create(ctx), {
  client,
  type,
  message
});
