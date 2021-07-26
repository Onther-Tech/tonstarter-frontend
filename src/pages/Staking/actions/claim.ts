import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {BASE_PROVIDER} from 'constants/index'

type Claim = {
  userAddress: string | null | undefined;
  stakeContractAddress: string;
  saleEndTime: string | Number;
  library: any;
  canRewardAmount: string;
  myEarned: string;
  handleCloseModal: any;
};

export const claimReward = async (args: Claim) => {
  const {
    userAddress,
    stakeContractAddress,
    saleEndTime,
    library,
    canRewardAmount,
  } = args;
  const currentBlock = await BASE_PROVIDER.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  // < Stake1Vault(vault).totalRewardAmount(address(this))
  if (currentBlock < saleEndTime) {
    return alert('Sale is not ended!');
  } else if (canRewardAmount === '0.0') {
    return alert('unsufficient reward');
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
      const receipt = await StakeTONContract.connect(signer)?.claim();
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
