import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Input,
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {openModal, selectModalType} from 'store/modal.reducer';
import {fetchSwapPayload} from './utils/fetchSwapPayload';
import {swapWTONtoTOS} from '../actions';

export const SwapModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();

  const stakeBalanceTON = data?.data?.stakeContractBalanceTon;
  const totalStakedAmountL2 = data?.data?.totalStakedAmountL2;
  const totalStakedAmount = data?.data?.totalStakedAmount;
  const totalPendingUnstakedAmountL2 = data?.data?.totalPendingUnstakedAmountL2;

  const [swappedBalance, setSwappedBalance] = useState<string | undefined>(
    undefined,
  );

  let balance =
    Number(stakeBalanceTON) +
    Number(totalStakedAmountL2) -
    Number(totalStakedAmount) +
    Number(totalPendingUnstakedAmountL2) -
    Number(swappedBalance);
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    async function swapPayload(data: any) {
      const result = await fetchSwapPayload(
        data.library,
        data.account,
        data.contractAddress,
      );
      return setSwappedBalance(result === undefined ? '0.00' : result);
    }
    swapPayload(data);
  }, [data]);

  const handleChange = useCallback((e) => setValue(e.target.value), []);
  const setMax = useCallback((_e) => setValue(balance), [balance]);

  const handleCloseModal = () => {
    dispatch(openModal({type: 'manage', data: data.data}));
    setValue(0);
  };

  return (
    <Modal
      isOpen={data.modal === 'swap' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
        <ModalBody p={0}>
          <Box 
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Swap
            </Heading>
            {/* <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              
            </Text> */}
          </Box>

          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              value={value}
              width={'xs'}
              mr={6}
              onChange={handleChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            <Box position={'absolute'} right={5}>
              <Button
                onClick={setMax}
                type={'button'}
                variant="outline"
                _focus={{
                  outline: 'none',
                }}>
                Max
              </Button>
            </Box>
          </Stack>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pt="33px" pb="13px">
              <Text fontWeight={500} fontSize={'0.813em'} color={'gray.400'}>
                Available Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {balance} TON
              </Text>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() =>
                swapWTONtoTOS({
                  userAddress: account,
                  amount: value.toString(),
                  contractAddress: data?.data?.contractAddress,
                  status: data?.data?.status,
                  library: library,
                  handleCloseModal: handleCloseModal,
                })
              }>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
