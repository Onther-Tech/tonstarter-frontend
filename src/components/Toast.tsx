import {useToast} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {useState} from 'react';
import {useEffect} from 'react';
import {selectToast} from 'store/app/toast.reducer';

export const Toast = () => {
  const toast = useToast();
  const {data, loading, currentRequestId} = useAppSelector(selectToast);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (currentRequestId !== undefined) {
      setView(true);
    }
  }, [data, currentRequestId]);

  return (
    <>
      {view === true && loading !== 'pending'
        ? toast(
            //@ts-ignore
            data,
          ) && setView(false)
        : null}
    </>
  );
};
