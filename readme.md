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
  <HexnutContext.Provider value={client}>
    <App/>
  </HexnutContext.Provider>
);
```


### useHexnutMiddleware hook for react

This hook can be used when a react component (most likely a view) should control the middleware chain. It clears all the middleware and sets the chain provided to the hook.

```javascript
const useHexnutMiddleware = middlewareArray => {
  const middlewareStr = middlewareArray.map(mw => mw.toString()).join('');
  useEffect(() => {
    client.middleware.splice();
    middlewareArray.forEach(middleware => client.use(middleware));
  }, [middlewareStr]);
};


// Then, inside a function component
const MyComponent = props => {
  const client = useContext(clientContext);
  const [receivedMsg, setReceivedMsg] = useState(false);

  useHexnutMiddleware([
    bodyparser.json(),
    ctx => {
      if (ctx.isMessage) {
        setReceivedMsg(true);
        if (ctx.message.type === 'showProps') {
          ctx.send(JSON.stringify(props));
        }
      }
    }
  ]);

  return receivedMsg
    ? <div>We got a message</div>
    : <div>Radio silence</div>;
}
```