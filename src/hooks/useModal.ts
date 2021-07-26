import {useAppDispatch} from 'hooks/useRedux';
import store from 'store';
import {
  closeModal,
  closeConfirmModal,
  openConfirm,
  SubModalPayload,
} from 'store/modal.reducer';

export const useModal = (
  setValue?: React.Dispatch<React.SetStateAction<any>>,
) => {
  const dispatch = useAppDispatch();
  const handleCloseModal = () => {
    if (setValue) {
      setValue('0');
    }
    dispatch(closeModal());
  };

  const handleOpenConfirmModal = ({type, data}: SubModalPayload) => {
    dispatch(openConfirm({type, data}));
  };
  const handleCloseConfirmModal = () => {
    dispatch(closeConfirmModal());
  };
  const handleCheckConfirm = () => {
    dispatch(closeConfirmModal());
  };
  const isConfirmed = () => {
    return store.getState().modal.sub.isChecked;
  };
  return {
    handleCloseModal,
    handleOpenConfirmModal,
    handleCloseConfirmModal,
    handleCheckConfirm,
    isConfirmed,
  };
};
