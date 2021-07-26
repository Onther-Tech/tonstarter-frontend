import {useDispatch} from 'react-redux';
import {openToast} from 'store/app/toast.reducer';

type Payload = {
  status: 'success' | 'error';
  title: string;
  description: string;
  duration: number;
  isClosable: boolean;
};

export const useToast = () => {
  const dispatch = useDispatch();
  const toastMsg = (payload: Payload) => {
    //@ts-ignore
    return dispatch(openToast({payload}));
  };
  return {toastMsg};
};
