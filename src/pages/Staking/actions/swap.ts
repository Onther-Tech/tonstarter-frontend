import {getSigner} from 'utils/contract';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {Contract} from '@ethersproject/contracts';

import {toWei} from 'web3-utils';
import * as StakeTON from 'services/abis/StakeTON.json';

type UnstakeFromLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  status: string;
  library: any;
  handleCloseModal: any;
};

export const swapWTONtoTOS = async (args: UnstakeFromLayer2) => {
  const {userAddress, amount, contractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const amountRay = toWei(amount, 'gether');
  const signer = getSigner(library, userAddress);
  let deadline = Date.now() / 1000 + 900;
  deadline = parseInt(deadline.toString());
  try {
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amountRay,
      0,
      deadline,
      0,
      1,
    );
    store.dispatch(setTxPending({tx: true}));
    alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    if (receipt) {
      store.dispatch(setTxPending({tx: false}));
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
