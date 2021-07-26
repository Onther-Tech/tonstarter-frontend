import {getTokamakContract, getSigner} from '../../../utils/contract';
// import {Contract} from '@ethersproject/contracts';
import store from '../../../store';
import {setTxPending} from '../../../store/tx.reducer';
import {toastWithReceipt} from 'utils';

type AirdropClaimProps = {
  userAddress: string | null | undefined;
  library: any;
  handleCloseModal: any;
};

export const claimAirdrop = async (args: AirdropClaimProps) => {
  const {userAddress, library} = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const Airdrop = getTokamakContract('Airdrop', library);
  // const Airdrop = getContract('Airdrop')
  const signer = getSigner(library, userAddress);

  try {
    const receipt = await Airdrop.connect(signer)?.claim();
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending);
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
