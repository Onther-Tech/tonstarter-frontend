import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import * as TOSABI from 'services/abis/TOS.json';
import {getContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import {convertToWei} from 'utils/number';

type IncreaseAmount = {
  account: string;
  library: any;
  lockId: string;
  amount: string;
};

export const increaseAmount = async (args: IncreaseAmount) => {
  const {account, library, lockId, amount} = args;
  const {LockTOS_ADDRESS, TOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const TosContract = getContract(TOS_ADDRESS, TOSABI.abi, library);
  const weiAmount = convertToWei(amount);
  const signer = getSigner(library, account);

  await TosContract.connect(signer).approve(LockTOSContract.address, weiAmount);

  const res = await TosContract.connect(signer).approve(
    LockTOSContract.address,
    weiAmount,
  );

  const fres = await res.wait().then(() => {
    return LockTOSContract.connect(signer).increaseAmount(lockId, weiAmount);
  });

  return await fres.wait().then((receipt: any) => {
    store.dispatch(
      setTransaction({
        transactionType: 'Dao',
        blockNumber: receipt.blockNumber,
      }),
    );
  });
};
