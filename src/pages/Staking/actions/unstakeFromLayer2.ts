import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import {utils} from 'ethers';
import * as StakeTON from 'services/abis/StakeTON.json';

type UnstakeFromLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  status: string;
  maxBalance: string;
  library: any;
  handleCloseModal: any;
};
const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const unstakeL2 = async (args: UnstakeFromLayer2) => {
  const {userAddress, amount, contractAddress, maxBalance, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const signer = getSigner(library, userAddress);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  
  const wtonAmount = utils.parseUnits(amount, '27');
  let inputValue = (Number(wtonAmount.toString()) > Number(maxBalance.toString())) ? maxBalance : wtonAmount;
  
  try {
    const receipt = await StakeTONContract.connect(
      signer,
    ).tokamakRequestUnStaking(TokamakLayer2_ADDRESS, inputValue);
    store.dispatch(setTxPending({tx: true}));
    alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    await receipt.wait();
    if (receipt) {
      store.dispatch(setTxPending({tx: false}));
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
