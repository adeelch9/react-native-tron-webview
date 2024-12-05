import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

const Web3View = ({ provider, url, chainId, style }) => {
  const webViewRef = useRef(null);
  const [injectedJavaScript, setInjectedJavaScript] = useState(null);

  const handleMessage = async (event) => {
    const { method, params, id } = JSON.parse(event.nativeEvent.data);

    try {
      let result;
      switch (method) {
        case 'trx_accounts':
        case 'trx_requestAccounts':
          result = 'your address';
          break;

        case 'trx_chainId': {
          const _chainId = chainId || 1;
          result = '0x' + _chainId.toString(16);
          break;
        }

        case 'trx_blockNumber': {
          result = '0x1';
          break;
        }

        case 'trx_signTypedData_v4': {
          result = '0x1';
          break;
        }

        case 'personal_sign':
          console.log('result', result, method, params);

          result = await provider.signMessage(params[0]);
          break;

        case 'trx_sendTransaction': {
          result = await provider.sendTransaction({
            ...params[0],
            chainId: '1',
          });
          break;
        }

        case 'trx_':
          result = '0x5208';
          break;
        case 'trx_call':
          result = await provider.call({ method, params }, chainId);
          break;

        default:
          console.log('inside default');

          result = await provider.send(
            {
              method,
              params,
              jsonrpc: '2.0',
            },
            chainId
          );
          console.log('result', result, method, params);
      }

      console.log('result', result, method, params);

      webViewRef.current?.postMessage(JSON.stringify({ id, result }));
    } catch (error) {
      console.log('error', error);

      webViewRef.current?.postMessage(
        JSON.stringify({ id, error: error.message })
      );
    }
  };

  useEffect(() => {
    const injectedScript = `
            window.tron = {
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
                // isMetaMask: true,
                isConnected: () => true,
            };
            window.web3 = { currentProvider: window.tron };
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
