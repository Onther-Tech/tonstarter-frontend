import { gql } from 'apollo-boost';

// const poolParam = `
//   id
//   createdAtBlockNumber
//   token0 {id}
//   token1 {id}
// `;
export const GET_POOL_INFO = gql`{
  query GetPool {
    pools(first: 5) {
      id
    }
  }
}`

export const GET_FACTORIES = gql`
  query GetFactory {
    factories (first:5) {
      id
      poolCount
    }
  }
`


  // query pools(where: {id:"0x7b2a5f8956ff62b26ac87f22165f75185e2ad639"}) {