const ctx = {
  send(...args) {
    this.client.send(...args);
  },

  get isConnection() {
    return this.type === 'connection';
  },

  get isMessage() {
    return this.type === 'message';
  }
};

module.exports = (client, type, message) => Object.assign(Object.create(ctx), {
  client,
  type,
  message
});
