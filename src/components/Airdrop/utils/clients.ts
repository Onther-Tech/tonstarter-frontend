import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';

export default {
  mainnet: new ApolloClient({
    uri: 'https://gateway.thegraph.com/api/db01f464b71f01a5177df9213afa4126/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2',
    cache: new InMemoryCache({}) as any,
  }),
  rinkeby: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-rinkeby',
    cache: new InMemoryCache({}) as any,
  })
};
