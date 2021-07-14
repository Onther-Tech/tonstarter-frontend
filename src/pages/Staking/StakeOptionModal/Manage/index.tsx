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
  Stack,
  Grid,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {fetchWithdrawPayload} from './utils/fetchWithdrawPayload';
import {closeSale} from '../../actions';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useCallback} from 'react';
import {ModalType} from 'store/modal.reducer';
import {closeModal, openModal, selectModalType} from 'store/modal.reducer';

export const ManageModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  let balance = data?.data?.stakeContractBalanceTon;
  let closed;

  try {
    closed = data?.data?.saleClosed
  } catch (e) {
    console.log(e)
  }

  const withdrawPayload = async (data: any) => {
    const result = await fetchWithdrawPayload(
      data.library,
      data.account,
      data.contractAddress,
    );
    return result;
  };
  // console.log(data?.data);

  const withdrawData = useCallback(async (modal: ModalType, data: any) => {
    const payloadWithdraw = await withdrawPayload(data?.data);
    const payload = {
      ...data?.data,
      withdrawableAmount: payloadWithdraw,
    };
    dispatch(openModal({type: modal, data: payload}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      isOpen={data.modal === 'manage' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
      <ModalOverlay />
      <ModalContent
        w={'21.875em'}
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        pt={'1.250em'}
        pb={'1.563em'}>
        <ModalBody p={0}>
          <Box
            textAlign="center"
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
              Manage
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'}>
              You can manage tokens
            </Text>
          </Box>

          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}
            mb={'25px'}>
            <Box textAlign={'center'}>
              <Text fontSize={'0.813em'} color={'blue.300'} mb={'1.125em'}>
                Available balance
              </Text>
              <Text fontSize={'2em'}>
                {balance} <span style={{fontSize: '13px'}}>TON</span>
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent="space-between"
              flexDir="column"
              w={'100%'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Total
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {data.data?.totalStakedAmount} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Staked in Layer 2
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {data.data?.totalStakedAmountL2} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Pending UnStaked in Layer 2
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {data.data?.totalPendingUnstakedAmountL2} TON
                </Text>
              </Flex>
            </Box>
          </Stack>

          <Grid
            templateColumns={'repeat(2, 1fr)'}
            pl="19px"
            pr="19px"
            gap={'12px'}>
            {/* <Button colorScheme="blue" onClick={() => toggleModal('stakeL2')}> */}
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'0.750em'}
              fontWeight={100}
              isDisabled={closed?!closed:false}
              onClick={() =>
                dispatch(openModal({type: 'stakeL2', data: data.data}))
              }
              _hover={{backgroundColor: 'blue.100'}}>
              Stake in Layer2
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              isDisabled={closed?!closed:false}
              onClick={() =>
                dispatch(openModal({type: 'unstakeL2', data: data.data}))
              }>
              Unstake from Layer2
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              isDisabled={closed?!closed:false}
              onClick={() => withdrawData('withdraw', data)}>
              Withdraw
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              isDisabled={closed?!closed:false}
              onClick={() =>
                dispatch(openModal({type: 'swap', data: data.data}))
              }>
              Swap
            </Button>
            <Flex w="200%" justifyContent="center">
              <Button
                width="150px"
                bg={'blue.500'}
                color={'white.100'}
                fontSize={'12px'}
                fontWeight={100}
                _hover={{backgroundColor: 'blue.100'}}
                isDisabled={data.data?.fetchBlock < data.data?.miningStartTime}
                onClick={() =>
                  closeSale({
                    userAddress: account,
                    vaultContractAddress: data.data.vault,
                    miningEndTime: data.data.miningEndTime,
                    library: library,
                    handleCloseModal: dispatch(closeModal()),
                  })
                }>
                End Sale
              </Button>
            </Flex>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
