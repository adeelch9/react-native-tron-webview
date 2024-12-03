# react-native-tron-webview (⚠️Beta)

web3 dapp wallet injector webview for react-native with Tron network support

This is a fork of react-native-dapp-explorer modified to work with Tron network.

## Installation

```sh
npm install @adeelch9/react-native-tron-webview
```

## Usage

```js
import provider from './tronwallet';
import { Web3View } from '@adeelch9/react-native-tron-webview';

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
