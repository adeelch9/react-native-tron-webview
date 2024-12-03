# react-native-tron-webview (⚠️Beta)

web3 dapp wallet injector webview for react-native with Tron network support

This is a fork of react-native-dapp-explorer modified to work with Tron network.

## Installation

Since this package is not yet published to npm, you can install it using one of the following methods:

### From GitHub
```sh
npm install git+https://github.com/adeelch9/react-native-tron-webview.git
```

### From Local Directory
If you have the package locally:
```sh
npm install file:/path/to/react-native-tron-webview
```

## Usage

```js
import provider from './tronwallet';
import { Web3View } from 'react-native-tron-webview';

function MyApp() {
  const ref = useRef();

  return (
    <Web3InjectedWalletView
      provider={provider}
      chainId="728126428" // Tron Mainnet
      url="https://your-tron-dapp-url.com"
      style={{ flex: 1, width: '100%' }}
      webviewRef={ref}
    />
  );
}
```

## Supported Networks
- Tron Mainnet (chainId: 728126428)
- Tron Sepolia Testnet (chainId: 11155111)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
