import {ApolloClient, InMemoryCache} from '@apollo/client';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {convertNumber} from 'utils/number';

// const typeDefs = gql``;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // typeDefs,
  resolvers: {
    User: {
      async getUserBalance(_, contractAddress) {
        const user = store.getState().user.data;
        const {address: account, library} = user;
        const {userStaked, userRewardTOS} = await fetchUserData(
          library,
          account,
          contractAddress,
        );
        return {
          userStaked: convertNumber({amount: userStaked}),
          userRewardTOS: convertNumber({amount: userRewardTOS}),
        };
      },
      test() {
        return 'test';
      },
    },
  },
});

const fetchUserData = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getUserInfo(library, account, contractAddress);
  const {userStaked, userRewardTOS} = res;
  return {
    userStaked,
    userRewardTOS,
  };
};

const getUserInfo = async (
  // stakeInfo: Partial<Stake>,
  // stakeContractAddress: string,
  library: any,
  account: string,
  contractAddress: string,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const staked = await StakeTONContract?.userStaked(account);
  return {
    userStaked: staked.amount,
    userRewardTOS: staked.claimedAmount,
  };
};
