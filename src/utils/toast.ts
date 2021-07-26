// import {fetchStakes} from 'pages/Staking/staking.reducer';
import {openToast} from 'store/app/toast.reducer';
import store from '../store';
import {fetchUserInfo} from '../store/app/user.reducer';

export const toastWithReceipt = async (
  recepit: any,
  setTxPending: any,
  stakeContractAddress?: string,
) => {
  try {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: 'Success',
          description: `Tx is being successfully pending!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        },
      }),
    );
    store.dispatch(setTxPending({tx: false}));

    await recepit
      .wait()
      .then((result: any) => {
        if (result) {
          const {address, library} = store.getState().user.data;
          //@ts-ignore
          store.dispatch(fetchUserInfo({address, library}));
          // setTimeout(() => {
          //   //fetch server
          //   const user = store.getState().user.data;
          //   const {address: account, library} = user;
          //   store.dispatch(fetchStakes({account, library}) as any);
          // }, 0);
        }
      })
      .catch((e: any) => console.log(e));
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
