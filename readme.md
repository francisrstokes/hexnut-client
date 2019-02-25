# Hexnut Client

`hexnut-client` is a middleware based websocket client designed to be used with <a href="https://github.com/francisrstokes/hexnut">Hexnut</a>.

To get an idea about the core concepts of hexnut, <a href="https://github.com/francisrstokes/hexnut/blob/master/docs/core.md">check out the documentation page for hexnut server.</a>

## Installation

```bash
npm i hexnut-client
```

## Usage

### Creating a client

```javascript
const HexnutClient = require('hexnut-client');

const client = new HexnutClient();

client.connect('ws://localhost:8080');
```

### Using middleware

```javascript
const HexnutClient = require('hexnut-client');
const handle = require('hexnut-handle');

const client = new HexnutClient();

client.use(handle.connect(ctx => {
  ctx.send('Hello server!');
}));

client.connect('ws://localhost:8080');
```

## Recipes

### Using Hexnut Client with react

Using Hexnut with react is easily accomplished via the react context API.

```javascript
const HexnutClient = require('hexnut-client');
const React = require('react');
const reactDOM = require('react-dom');

const client = new HexnutClient();
client.connect('ws://localhost:8080');

const HexnutContext = React.createContext(client);

// ... Later

reactDOM.render(
  document.getElementById('root'),
  <HexnutContext.Provider>
    <App/>
  </HexnutContext.Provider>
);
```