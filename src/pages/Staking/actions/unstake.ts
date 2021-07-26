import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {BASE_PROVIDER} from 'constants/index'

type Unstake = {
  userAddress: string | null | undefined;
  endTime: string | Number;
  library: any;
  stakeContractAddress: string;
  mystaked: string;
  handleCloseModal: any;
};

export const unstake = async (args: Unstake) => {
  const {userAddress, endTime, library, stakeContractAddress, mystaked} = args;
  const currentBlock = await BASE_PROVIDER.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < endTime) {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `Sale has not ended yet`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  } else if (mystaked === '0.0') {
    return alert('You have no staked balance in this vault.');
  } else {
    const StakeTONContract = await new Contract(
      stakeContractAddress,
      StakeTON.abi,
      library,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      const receipt = await StakeTONContract.connect(signer)?.withdraw();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, stakeContractAddress);
      }
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  }
};
