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
  Select,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useUser} from 'hooks/useUser';
import {useToast} from 'hooks/useToast';
import {useState, useEffect, useRef} from 'react';
import {stakeTOS} from '../utils/stakeTOS';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';

type SelectPeriod = '1 month' | '6 months' | '1 year' | '3 years';

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};

export const DaoStakeModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {signIn, account, library} = useUser();
  const {toastMsg} = useToast();

  const [selectPeriod, setSelectPeriod] = useState<string | undefined>(
    undefined,
  );
  const [dateValue, setDateValue] = useState(0);
  const [lockDateValue, setLockDateValue] = useState<string | undefined>(
    undefined,
  );
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const periods = ['1 month', '6 months', '1 year', '3 years'];

  const {btnStyle} = theme;
  const {value, setValue, onChange} = useInput('0');
  const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);
  const keys = [undefined, '', '0', '0.', '0.0', '0.00'];
  const btnDisabled =
    keys.indexOf(value) !== -1 || dateValue === 0 ? true : false;

  const focusTarget = useRef<any>([]);
  const focusCustomTarget = useRef(null);

  const changeBorderColor = (index: any) => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
    current[index].style.border = 'solid 1px #2a72e5';
    setSelectPeriod(current[index].id);
  };

  const changeAllBorderColor = () => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
  };

  useEffect(() => {
    if (selectPeriod === 'weeks' || selectPeriod === 'months') {
      if (selectPeriod === 'weeks') {
        setDateValue(Number(lockDateValue));
      }
      if (selectPeriod === 'months') {
        setDateValue(Number(lockDateValue) * 4);
      }
    }
    if (selectPeriod === '1 month') {
      setDateValue(4);
    }
    if (selectPeriod === '6 months') {
      setDateValue(24);
    }
    if (selectPeriod === '1 year') {
      setDateValue(48);
    }
    if (selectPeriod === '3 years') {
      setDateValue(144);
    }
    // return setDateValue(select)
  }, [selectPeriod, lockDateValue]);

  if (signIn === false || account === undefined) {
    return <></>;
  }

  return (
    <Modal
      isOpen={data.modal === 'dao_stake' ? true : false}
      isCentered
      onClose={() => {
        setIsCustom(false);
        handleCloseModal();
      }}>
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
              Stake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn sTOS
            </Text>
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
              maxW={'160px'}
              minW={'20px'}
              p={0}
              ml={'29px'}
              mr="5px"
              w={value === '0' || undefined ? '20px' : `${20 * value.length}px`}
              value={value}
              onKeyDown={onKeyDown}
              onChange={onChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            <Text
              pt="6px"
              color={themeDesign.tosFont[colorMode]}
              fontWeight={600}>
              TOS
            </Text>
          </Stack>

          <Stack as={Flex} justifyContent={'center'} alignItems={'center'}>
            <Box textAlign={'center'} pt="18px" mb={'28px'}>
              <Text fontWeight={500} fontSize={'0.813em'} color={'blue.300'}>
                Available Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {data?.data?.userTosBalance} TOS
              </Text>
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
            <Box textAlign={'center'} pb="13px">
              <Text
                fontWeight={600}
                fontSize={'0.813em'}
                color={themeDesign.font[colorMode]}
                mb="10px">
                Locking Period
              </Text>
              <Flex
                w={'320px'}
                h="26px"
                mb="10px"
                fontSize={'0.750em'}
                cursor={'pointer'}>
                {periods.map((period: string, index: number) => (
                  <Text
                    w={'80px'}
                    h="100%"
                    id={period}
                    kye={index}
                    ref={(el) => (focusTarget.current[index] = el)}
                    borderTop={themeDesign.border[colorMode]}
                    borderBottom={themeDesign.border[colorMode]}
                    borderLeft={
                      index !== 0 ? '' : themeDesign.border[colorMode]
                    }
                    borderLeftRadius={index === 0 ? 4 : 0}
                    borderRightRadius={index === periods.length - 1 ? 4 : 0}
                    borderRight={themeDesign.border[colorMode]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                      changeBorderColor(index);
                      setIsCustom(false);
                    }}>
                    {period as SelectPeriod}
                  </Text>
                ))}
              </Flex>
              {!isCustom && (
                <Button
                  w={'120px'}
                  h="26px"
                  bg="transparent"
                  fontWeight={100}
                  border={themeDesign.border[colorMode]}
                  fontSize={'0.750em'}
                  _hover={{}}
                  onClick={() => {
                    setIsCustom(true);
                    changeAllBorderColor();
                  }}>
                  Customized
                </Button>
              )}
              {isCustom && (
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize={'0.750em'} color="gray.250" fontWeight={600}>
                    Customized
                  </Text>
                  <Input
                    w="132px"
                    h="32px"
                    ref={focusCustomTarget}
                    onChange={(e) => {
                      const {value} = e.target;
                      setLockDateValue(value);
                    }}
                    onClick={() => changeAllBorderColor()}></Input>
                  <Select
                    w="100px"
                    h="32px"
                    fontSize={'0.750em'}
                    onChange={(e) => {
                      const type = e.target.value;
                      setSelectPeriod(type);
                    }}>
                    <option value="" disabled selected hidden>
                      Select
                    </option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </Select>
                </Flex>
              )}
              <Flex flexDir="column" mt={'10px'}>
                <Flex justifyContent="space-between">
                  <Text>Estimated end date</Text>
                  <Text>2021.12.31(KST)</Text>
                  <Tooltip
                    hasArrow
                    placement="top"
                    label="Lock up-period is calculated  based on every Monday 00: 00 UTC."
                    color={theme.colors.white[100]}
                    bg={theme.colors.gray[375]}>
                    <Image src={tooltipIcon} />
                  </Tooltip>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text>Estimated reward</Text>
                  <Text>1,000 sTOS</Text>
                  <Tooltip
                    hasArrow
                    placement="top"
                    label="This estimator could be change depending on the situation"
                    color={theme.colors.white[100]}
                    bg={theme.colors.gray[375]}>
                    <Image src={tooltipIcon} />
                  </Tooltip>
                </Flex>
              </Flex>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              {...(btnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={btnDisabled ? {} : {...theme.btnHover}}
              disabled={btnDisabled}
              onClick={() => {
                if (
                  Number(value.replaceAll(',', '')) >
                  Number(data?.data?.userTosBalance)
                ) {
                  return toastMsg({
                    status: 'error',
                    title: 'Error',
                    description: 'Balance is not enough',
                    duration: 5000,
                    isClosable: true,
                  });
                }
                handleOpenConfirmModal({
                  type: 'confirm',
                  data: {
                    from: 'dao/stake',
                    amount: value,
                    period: dateValue,
                    action: () =>
                      stakeTOS({
                        account,
                        library,
                        amount: value.replaceAll(',', ''),
                        period: dateValue,
                        handleCloseModal: handleCloseModal(),
                      }),
                  },
                });
              }}>
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
