import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { TronWeb } from 'tronweb';

const Web3View = ({ provider, url, chainId, style }) => {
  const webViewRef = useRef(null);
  const [injectedJavaScript, setInjectedJavaScript] = useState(null);
  const tronWeb = new TronWeb({
    fullHost: provider,
  });

  const handleMessage = async (event) => {
    const { method, params, id } = JSON.parse(event.nativeEvent.data);

    try {
      const methodsMap = {
        trx_accounts: async () => ['TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'],
        tron_requestAccounts: async () => ['TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'],
        trx_chainId: async () => {
          const _chainId = await tronWeb.address.toHex(chainId);
          return '0x' + _chainId.toString();
        },
        trx_blockNumber: async () => await tronWeb.trx.getCurrentBlock(),
        trx_getBalance: async () =>
          await tronWeb.trx.getBalance('TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'),
        trx_getTransactionCount: async () =>
          await tronWeb.trx.getTransactionInfo(
            'TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'
          ),
        sendRawTransaction: async () =>
          await tronWeb.trx.sendTransaction(
            'TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz',
            10000
          ),
        signMessage: async () =>
          await tronWeb.trx.signTransaction(
            'TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'
          ),
        trx_sign: async () =>
          await tronWeb.trx.sign('TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'),
        sendTransaction: async () =>
          await tronWeb.trx.getBalance('TR1NQvHhQV8B9aW4s8jxJgEjQH7dPvMvz'),
      };

      let result;

      if (methodsMap[method]) {
        result = await methodsMap[method]();
      } else {
        console.log('Method not explicitly handled, delegating to tronWeb');
        throw new Error('Method not supported');
      }

      console.log('Result:', result, method, params);
      webViewRef.current?.postMessage(JSON.stringify({ id, result }));
    } catch (error) {
      console.error('Error:', error);
      webViewRef.current?.postMessage(
        JSON.stringify({ id, error: error.message })
      );
    }
  };

  useEffect(() => {
    const injectedScript = `
            window.tronLink = {
                request: async function({method, params}) {
                    return new Promise((resolve, reject) => {
                      const messageId = Date.now() * Math.pow(10, 3) +  Math.floor(Math.random() * Math.pow(10, 3));
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                          id: messageId,
                          method: method,
                          params: params
                      }));

                      window.addEventListener("message", function(event) {
                          const data = JSON.parse(event.data);
                          if (data.id && data.id === messageId) {
                            if (data.error) {
                              reject(data.error);
                            } else {
                              resolve(data.result);
                            }
                          }
                      });
                    });
                },
                isTronLink: true,
                isConnected: () => true,
                ready: true
            };
            window.tronWeb = { currentProvider: window.tronLink };
            true;  // ensure the injected script doesn't return a value
        `;

    setInjectedJavaScript(injectedScript);
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: url }}
      style={style}
      startInLoadingState={true}
      javaScriptEnabledAndroid={true}
      onMessage={handleMessage}
      injectedJavaScript={injectedJavaScript}
    />
  );
};

export default Web3View;
