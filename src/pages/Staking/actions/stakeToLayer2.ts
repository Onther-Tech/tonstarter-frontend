import {getTokamakContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {convertToWei} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {BASE_PROVIDER} from 'constants/index'

type StakeToLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  miningEndTime: string | Number;
  status: string;
  globalWithdrawalDelay: string;
  library: any;
  handleCloseModal: any;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const stakeL2 = async (args: StakeToLayer2) => {
  const {
    userAddress,
    amount,
    miningEndTime,
    contractAddress,
    status,
    globalWithdrawalDelay,
    library,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const currentBlock = await BASE_PROVIDER.getBlockNumber();
  const endBlock = Number(miningEndTime);
  const TON = getTokamakContract('TON', library);
  const tonBalance = await TON.balanceOf(userAddress);
  const tonAmount = convertToWei(amount);

  if (currentBlock > endBlock - Number(globalWithdrawalDelay)) {
    return alert('staking period has ended'); // ToDo: comment check
  } else if (status === 'end') {
    return alert('sale is not closed!');
  } else if (tonBalance < tonAmount) {
    return alert('unsufficient balance!');
  } else {
    const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      store.dispatch(setTxPending({tx: true}));
      await StakeTONContract.connect(signer)
        .tokamakStaking(TokamakLayer2_ADDRESS, tonAmount)
        .then((receipt: any) => {
          alert(`Tx sent successfully! Tx hash is ${receipt?.hash}`);
          store.dispatch(setTxPending({tx: false}));
        });
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  }
};
