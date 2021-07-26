import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {ChakraProvider} from '@chakra-ui/react';
import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';
// import {I18nextProvider} from 'react-i18next';
import {HelmetProvider} from 'react-helmet-async';

import theme from 'theme';
import store from 'store';
// import i18n from 'i18n';
import {NetworkContextName} from 'constants/index';
import {Router} from 'pages/Router';

import reportWebVitals from './reportWebVitals';
import {getLibrary} from 'utils';
import {Toast} from 'components/Toast';
import {ApolloProvider} from '@apollo/client';
import {client} from 'client/client';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <HelmetProvider>
    <ApolloProvider client={client}>
      {/* <I18nextProvider i18n={i18n}> */}
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          {/* <ColorModeScript /> */}
          <Provider store={store}>
            <ChakraProvider resetCSS theme={theme}>
              <Toast></Toast>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ChakraProvider>
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
      {/* </I18nextProvider> */}
    </ApolloProvider>
  </HelmetProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
