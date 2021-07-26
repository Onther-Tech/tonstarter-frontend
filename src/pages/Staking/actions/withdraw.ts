import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED, BASE_PROVIDER} from 'constants/index';

type Withdraw = {
  userAddress: string | null | undefined;
  contractAddress: string;
  miningEndTime: string;
  library: any;
  handleCloseModal: any;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const withdraw = async (args: Withdraw) => {
  const {userAddress, contractAddress, miningEndTime, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await BASE_PROVIDER.getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const signer = getSigner(library, userAddress);
  const endBlock = Number(miningEndTime);
  if (endBlock > currentBlock) {
    try {
      await StakeTONContract.connect(signer)
        .tokamakProcessUnStaking(TokamakLayer2_ADDRESS)
        .then((receipt: any) => {
          alert(`Tx sent successfully! Tx hash is ${receipt?.hash}`);
          store.dispatch(setTxPending({tx: false}));
        });
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  } else {
    return alert('not withdrawable time.');
  }
};
