import {Flex, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';
import useTokenDetail from '@Launch/hooks/useTokenDetail';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {
  Projects,
  PublicTokenColData,
  VaultLiquidityIncentive,
  VaultPublic,
  VaultType,
} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import InputField from './InputField';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import commafy from 'utils/commafy';
import {shortenAddress} from 'utils';
import DoubleCalendarPop from '../common/DoubleCalendarPop';
import SingleCalendarPop from '../common/SingleCalendarPop';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import {convertTimeStamp} from 'utils/convertTIme';
import {useToast} from 'hooks/useToast';
import {CustomTooltip} from 'components/Tooltip';

export const MainTitle = (props: {
  leftTitle: string;
  rightTitle: string;
  subTitle?: string;
}) => {
  const {leftTitle, rightTitle, subTitle} = props;
  const {colorMode} = useColorMode();
  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={
        colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
      }
      fontWeight={600}>
      <Text fontSize={14}>{leftTitle}</Text>
      <Flex>
        <Text>{rightTitle}</Text>
        {subTitle && (
          <Text
            ml={'5px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {subTitle}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const SubTitle = (props: {
  leftTitle: string;
  rightTitle: string | undefined;
  isLast?: boolean;
  percent?: number | undefined;
  isEdit: boolean;
  isSecondColData?: boolean;
  formikName: string;
  inputRef?: any;
}) => {
  const {
    leftTitle,
    rightTitle,
    isLast,
    percent,
    isEdit,
    isSecondColData,
    formikName,
    inputRef,
  } = props;
  const [inputVal, setInputVal] = useState<number | string>(
    //@ts-ignore
    rightTitle,
  );
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  function getTimeStamp() {
    switch (
      leftTitle as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Round 1'
        | 'Public Round 2'
    ) {
      case 'Snapshot': {
        return publicVault.snapshot;
      }
      case 'Whitelist': {
        return [publicVault.whitelist, publicVault.whitelistEnd];
      }
      case 'Public Round 1': {
        return [publicVault.publicRound1, publicVault.publicRound1End];
      }
      case 'Public Round 2': {
        return [publicVault.publicRound2, publicVault.publicRound2End];
      }
      default:
        return 0;
    }
  }

  const [dateRange, setDateRange] = useState<number | undefined[]>(
    getTimeStamp() as number | undefined[],
  );
  const [claimDate, setClaimDate] = useState<number | undefined>(
    getTimeStamp() as number | undefined,
  );

  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData},
  } = useAppSelector(selectLaunch);

  //@ts-ignore
  useEffect(() => {
    //Put timestamp
    switch (
      leftTitle as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Round 1'
        | 'Public Round 2'
    ) {
      case 'Snapshot': {
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              snapshot: claimDate,
            },
          }),
        );
      }
      case 'Whitelist': {
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              whitelist: dateRange[0],
              //@ts-ignore
              whitelistEnd: dateRange[1],
            },
          }),
        );
      }
      case 'Public Round 1': {
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              publicRound1: dateRange[0],
              //@ts-ignore
              publicRound1End: dateRange[1],
            },
          }),
        );
      }
      case 'Public Round 2': {
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              publicRound2: dateRange[0],
              //@ts-ignore
              publicRound2End: dateRange[1],
            },
          }),
        );
      }
      default:
        break;
    }
    /*eslint-disable*/
  }, [dateRange, claimDate, leftTitle]);

  let tempValueKey = () => {
    switch (leftTitle) {
      case 'Snapshot':
        return {key0: 'snapshot'};
      case 'Whitelist':
        return {
          key0: 'whitelist',
          key1: 'whitelistEnd',
        };
      case 'Public Round 1':
        return {
          key0: 'publicRound1',
          key1: 'publicRound1End',
        };
      case 'Public Round 2':
        return {
          key0: 'publicRound2',
          key1: 'publicRound2End',
        };
        defaut: break;
    }
  };

  const displayRightTitle = (leftTitle: any, rightTitle: any) => {
    switch (leftTitle) {
      case 'Public Round 1':
        return `${commafy(rightTitle)} ${values.tokenName}`;
      case 'Public Round 2':
        return `${commafy(rightTitle)} ${values.tokenName}`;
      case 'Token Allocation for Liquidity Pool (5~10%)':
        return `${rightTitle} %`;
      case 'Hard Cap':
        return `${commafy(rightTitle)} TON`;
      case 'Address for receiving funds':
        return rightTitle ? `${shortenAddress(rightTitle)}` : '-';
      default:
        return rightTitle;
    }
  };

  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={
        isLast
          ? ''
          : colorMode === 'light'
          ? 'solid 1px #e6eaee'
          : 'solid 1px #323232'
      }
      fontWeight={600}>
      {leftTitle === 'Public Round 1' && !isSecondColData ? (
        <Flex>
          <Text w={'88px'} color={'#7e8993'}>
            {leftTitle}
          </Text>
          <CustomTooltip
            msg={[
              'The sum of public round 1 and 2 must equal',
              'the value of total token allocation.',
            ]}
            toolTipH="44px"
            toolTipW={254}></CustomTooltip>
        </Flex>
      ) : (
        <Text
          color={'#7e8993'}
          w={!leftTitle.includes('or Liquidity Pool') ? '101px' : '201px'}>
          {leftTitle}
        </Text>
      )}
      {isEdit ? (
        isSecondColData ? (
          <Flex>
            <Flex flexDir={'column'} textAlign={'right'} mr={'8px'}>
              <Text>
                {
                  //@ts-ignore
                  tempVaultData[tempValueKey()?.key0]
                    ? convertTimeStamp(
                        //@ts-ignore
                        tempVaultData[tempValueKey()?.key0],
                        'YYYY.MM.DD HH:mm:ss',
                      )
                    : rightTitle?.split('~')[0] || '-'
                }
              </Text>

              {leftTitle !== 'Snapshot' && (
                <Text>
                  {
                    //@ts-ignore
                    tempVaultData[tempValueKey()?.key1]
                      ? `~ ${convertTimeStamp(
                          //@ts-ignore
                          tempVaultData[tempValueKey()?.key1],
                          'MM.DD HH:mm:ss',
                        )}`
                      : `~ ${rightTitle?.split('~')[1]}` || '-'
                  }
                </Text>
              )}
            </Flex>
            {leftTitle !== 'Snapshot' ? (
              <DoubleCalendarPop setDate={setDateRange}></DoubleCalendarPop>
            ) : (
              <SingleCalendarPop setDate={setClaimDate}></SingleCalendarPop>
            )}
          </Flex>
        ) : (
          <Flex>
            <InputField
              w={120}
              h={32}
              fontSize={13}
              value={inputVal}
              setValue={setInputVal}
              formikName={formikName}
              inputRef={inputRef}
              style={{textAlign: 'right'}}
              // numberOnly={
              //   leftTitle !== 'Address for receiving funds' &&
              //   !leftTitle.includes('Pool Address')
              // }
            ></InputField>
            {percent !== undefined && (
              <Text
                ml={'5px'}
                color={'#7e8993'}
                textAlign={'center'}
                lineHeight={'32px'}
                fontWeight={100}>
                {`(${
                  percent.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'
                }%)`}
              </Text>
            )}
          </Flex>
        )
      ) : String(rightTitle)?.includes('~') ? (
        <Flex flexDir={'column'} textAlign={'right'}>
          <Text>{String(rightTitle).split('~')[0]}</Text>
          <Text>~ {String(rightTitle).split('~')[1]}</Text>
        </Flex>
      ) : (
        <Flex>
          <Text textAlign={'right'}>
            {String(rightTitle)?.includes('undefined')
              ? '-'
              : displayRightTitle(leftTitle, rightTitle)}
          </Text>
          {percent !== undefined && (
            <Text ml={'5px'} color={'#7e8993'} textAlign={'right'}>
              {`(${percent.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'}%)`}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

const STOSTier = (props: {
  tier: string;
  requiredTos: number | undefined;
  allocatedToken: number | undefined;
  isLast?: boolean;
  isEdit: boolean;
  inputRef: any;
}) => {
  const {tier, requiredTos, allocatedToken, isLast, isEdit, inputRef} = props;
  const {colorMode} = useColorMode();
  const [inputVal, setInputVal] = useState(requiredTos);
  const [inputVal2, setInputVal2] = useState(allocatedToken);
  const {values} = useFormikContext<Projects['CreateProject']>();

  //@ts-ignore
  const publicRound1Allocation = values.vaults[0].publicRound1Allocation;
  const percent =
    (Number(allocatedToken) * 100) / Number(publicRound1Allocation);

  return (
    <Flex
      h={'60px'}
      alignItems="center"
      textAlign={'center'}
      borderBottom={
        isLast
          ? ''
          : colorMode === 'light'
          ? 'solid 1px #e6eaee'
          : 'solid 1px #323232'
      }
      fontWeight={600}>
      <Text color={'#7e8993'} w={'80px'}>
        {tier}
      </Text>
      {isEdit ? (
        <>
          <Flex w={'125px'} justifyContent="center">
            <InputField
              w={85}
              h={32}
              fontSize={13}
              value={inputVal}
              setValue={setInputVal}
              isStosTier={true}
              formikName={'requiredStos'}
              stosTierLevel={Number(tier) as 1 | 2 | 3 | 4}
              style={{textAlign: 'center'}}
              inputRef={inputRef}></InputField>
          </Flex>
          <Flex w={'137px'} justifyContent="center">
            <InputField
              w={85}
              h={32}
              fontSize={13}
              value={inputVal2}
              setValue={setInputVal2}
              isStosTier={true}
              stosTierLevel={Number(tier) as 1 | 2 | 3 | 4}
              style={{textAlign: 'right'}}
              formikName={'allocatedToken'}
              inputRef={inputRef}></InputField>
            <Text
              mx={'5px'}
              color={'#7e8993'}
              textAlign={'center'}
              lineHeight={'32px'}
              fontWeight={100}>
              {isNaN(percent)
                ? '(- %)'
                : `(${
                    percent.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'
                  }%)`}
            </Text>
          </Flex>
        </>
      ) : (
        <>
          <Text w={'125px'}>{commafy(requiredTos) || '-'}</Text>
          <Flex w={'137px'} justifyContent={'center'} alignItems={'center'}>
            <Text>{commafy(allocatedToken) || '-'}</Text>
            <Text
              ml={'5px'}
              color={'#7e8993'}
              textAlign={'center'}
              lineHeight={'32px'}
              fontWeight={100}>
              {isNaN(percent)
                ? '(- %)'
                : `(${
                    Number(percent)
                      .toFixed(3)
                      .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                  }%)`}
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

const PublicTokenDetail = (props: {
  firstColData:
    | PublicTokenColData['firstColData']
    | PublicTokenColData['liquidityColData']
    | null;
  secondColData: PublicTokenColData['secondColData'] | null;
  thirdColData: PublicTokenColData['thirdColData'] | null;
  isEdit: boolean;
}) => {
  const theme = useTheme();
  //@ts-ignore
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {firstColData, secondColData, thirdColData, isEdit} = props;
  const {values} = useFormikContext<Projects['CreateProject']>();
  // const publicVaultValue = vaults.filter((vault: VaultCommon) => {
  //   return vault.vaultName === 'Public';
  // });
  const {selectedVaultDetail} = useVaultSelector();
  const vaults = values.vaults;
  const inputRef = useRef({});
  const {
    data: {tempVaultData, selectedVaultType},
  } = useAppSelector(selectLaunch);

  const {toastMsg} = useToast();

  //Input Value Validating
  useEffect(() => {
    const errBorderStyle = '1px solid #ff3b3b';
    const noErrBorderStyle =
      colorMode === 'light' ? '1px solid #dfe4ee' : '1px solid #373737';
    const {current} = inputRef;

    switch (selectedVaultType as VaultType) {
      //Switch for each vault type
      //Check to include keys for validating

      case 'Public': {
        if (
          selectedVaultDetail &&
          current &&
          //@ts-ignore
          current.publicRound1Allocation !== null &&
          //@ts-ignore
          current.publicRound1Allocation !== undefined
        ) {
          const tokenAllocation = selectedVaultDetail.vaultTokenAllocation;
          const {
            publicRound1Allocation,
            publicRound2Allocation,
            requiredStos_1,
            requiredStos_2,
            requiredStos_3,
            requiredStos_4,
            allocatedToken_1,
            allocatedToken_2,
            allocatedToken_3,
            allocatedToken_4,
          } = current as {
            publicRound1Allocation: HTMLInputElement;
            publicRound2Allocation: HTMLInputElement;
            requiredStos_1: HTMLInputElement;
            requiredStos_2: HTMLInputElement;
            requiredStos_3: HTMLInputElement;
            requiredStos_4: HTMLInputElement;
            allocatedToken_1: HTMLInputElement;
            allocatedToken_2: HTMLInputElement;
            allocatedToken_3: HTMLInputElement;
            allocatedToken_4: HTMLInputElement;
          };
          const pr1TokenNum = Number(publicRound1Allocation.value);
          const pr2TokenNum = Number(publicRound2Allocation.value);
          const requiredStos_1_num = Number(requiredStos_1.value);
          const requiredStos_2_num = Number(requiredStos_2.value);
          const requiredStos_3_num = Number(requiredStos_3.value);
          const requiredStos_4_num = Number(requiredStos_4.value);
          const allocatedToken_1_num = Number(allocatedToken_1.value);
          const allocatedToken_2_num = Number(allocatedToken_2.value);
          const allocatedToken_3_num = Number(allocatedToken_3.value);
          const allocatedToken_4_num = Number(allocatedToken_4.value);
          const tokenIsOver = pr1TokenNum + pr2TokenNum - tokenAllocation > 0;
          const stosTokenAllocationOver =
            allocatedToken_1_num +
              allocatedToken_2_num +
              allocatedToken_3_num +
              allocatedToken_4_num -
              pr1TokenNum >
            0;

          if (tokenIsOver) {
            publicRound1Allocation.style.border = errBorderStyle;
            publicRound2Allocation.style.border = errBorderStyle;

            toastMsg({
              title: 'Token Allocation to this vault is not enough',
              description:
                'You have to put more token or adjust token allocation for public rounds',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return;
          } else {
            publicRound1Allocation.style.border = noErrBorderStyle;
            publicRound2Allocation.style.border = noErrBorderStyle;
          }
          if (stosTokenAllocationOver) {
            allocatedToken_1.style.border = errBorderStyle;
            allocatedToken_2.style.border = errBorderStyle;
            allocatedToken_3.style.border = errBorderStyle;
            allocatedToken_4.style.border = errBorderStyle;

            toastMsg({
              title: 'Public Round 1 Token Allocation is not enough',
              description:
                'You have to put more token or adjust token allocation for sTOS Tier',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
          } else {
            allocatedToken_1.style.border = noErrBorderStyle;
            allocatedToken_2.style.border = noErrBorderStyle;
            allocatedToken_3.style.border = noErrBorderStyle;
            allocatedToken_4.style.border = noErrBorderStyle;
          }
        }
      }
    }
  }, [selectedVaultType, tempVaultData, selectedVaultDetail]);

  return (
    <Grid
      {...OpenCampaginDesign.border({colorMode})}
      w={'100%'}
      templateColumns="repeat(3, 1fr)"
      fontSize={13}>
      <GridItem>
        <MainTitle
          leftTitle="Token"
          rightTitle={`${commafy(selectedVaultDetail?.vaultTokenAllocation)} ${
            values.tokenName
          }`}
          subTitle={
            selectedVaultDetail?.vaultTokenAllocation === 0
              ? '-'
              : `(${(
                  (Number(selectedVaultDetail?.vaultTokenAllocation) * 100) /
                  values.totalTokenAllocation
                )
                  .toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}%)`
          }></MainTitle>
        {firstColData?.map(
          (
            data: {
              title: string;
              content: string | undefined;
              percent?: number | undefined;
              formikName: string;
            },
            index: number,
          ) => {
            const {title, content, percent, formikName} = data;
            return (
              <SubTitle
                key={title}
                leftTitle={title}
                rightTitle={content}
                isLast={index + 1 === firstColData.length}
                inputRef={inputRef}
                percent={percent}
                isEdit={isEdit}
                formikName={formikName}></SubTitle>
            );
          },
        )}
        {firstColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={'60px'}
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no Token value.</Text>
          </Flex>
        )}
      </GridItem>
      <GridItem
        borderX={
          colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
        }>
        <MainTitle leftTitle="Schedule" rightTitle="KST"></MainTitle>
        {secondColData?.map(
          (data: {title: string; content: string; formikName: string}) => {
            const {title, content, formikName} = data;
            return (
              <SubTitle
                key={title}
                leftTitle={title}
                rightTitle={content}
                isEdit={isEdit}
                isSecondColData={true}
                formikName={formikName}></SubTitle>
            );
          },
        )}
        {secondColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={
              firstColData?.length !== undefined
                ? `${firstColData.length * 60}px`
                : '60px'
            }
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no Schedule value.</Text>
          </Flex>
        )}
      </GridItem>
      <GridItem>
        <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
        {thirdColData && (
          <Flex
            h={'60px'}
            alignItems="center"
            textAlign={'center'}
            borderBottom={
              colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
            }
            fontWeight={600}
            color={'#7e8993'}
            fontSize={13}>
            <Text w={'80px'}>Tier</Text>
            <Text w={'125px'}>Required TOS</Text>
            <Text w={'137px'}>Allocated Token</Text>
          </Flex>
        )}
        {thirdColData?.map((data: any, index: number) => {
          const {tier, requiredTos, allocatedToken} = data;
          return (
            <STOSTier
              key={tier}
              tier={tier}
              requiredTos={requiredTos}
              allocatedToken={allocatedToken}
              isLast={index + 1 === thirdColData.length}
              isEdit={isEdit}
              inputRef={inputRef}></STOSTier>
          );
        })}
        {thirdColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={
              firstColData?.length !== undefined
                ? `${firstColData.length * 60}px`
                : '60px'
            }
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no sTOS Tier value.</Text>
          </Flex>
        )}
      </GridItem>
    </Grid>
  );
};

const TokenDetail = (props: {isEdit: boolean}) => {
  const {isEdit} = props;
  const {
    data: {selectedVaultType, selectedVault, selectedVaultIndex},
  } = useAppSelector(selectLaunch);
  const {InitialLiquidityVault} = DEPLOYED;
  const InitialLiquidity_CONTRACT = useContract(
    InitialLiquidityVault,
    InitialLiquidityComputeAbi.abi,
  );
  const {TOS_ADDRESS} = DEPLOYED;
  const {values} = useFormikContext<Projects['CreateProject']>();
  const [poolAddress, setPoolAddress] = useState<string>('');
  const {publicTokenColData} = useTokenDetail();

  const VaultTokenDetail = useMemo(() => {
    switch (selectedVaultType) {
      case 'Public':
        if (publicTokenColData) {
          return (
            <PublicTokenDetail
              firstColData={publicTokenColData.firstColData}
              secondColData={publicTokenColData.secondColData}
              thirdColData={publicTokenColData.thirdColData}
              isEdit={isEdit}></PublicTokenDetail>
          );
        }
        return null;
      case 'Initial Liquidity': {
        const thisVault: VaultLiquidityIncentive = values.vaults.filter(
          //@ts-ignore
          (vault: VaultLiquidityIncentive) => vault.vaultName === selectedVault,
        )[0] as VaultLiquidityIncentive;
        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content: `${values.tokenName}-TOS`,
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: thisVault.poolAddress,
                formikName: 'poolAddress',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      }
      case 'TON Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'TOS Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'WTON-TOS LP Reward': {
        const {
          pools: {TOS_WTON_POOL},
        } = DEPLOYED;
        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content: 'WTON-TOS',
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: shortenAddress(TOS_WTON_POOL),
                formikName: 'poolAddress',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      }
      case 'C':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'DAO':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'Liquidity Incentive':
        const thisVault: VaultLiquidityIncentive = values.vaults.filter(
          //@ts-ignore
          (vault: VaultLiquidityIncentive) =>
            vault.index === selectedVaultIndex,
        )[0] as VaultLiquidityIncentive;

        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content:
                  thisVault?.isMandatory === true
                    ? `${values.tokenName}-TOS`
                    : thisVault?.tokenPair,
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: thisVault?.poolAddress
                  ? shortenAddress(thisVault?.poolAddress)
                  : '-',
                formikName: 'poolAddress',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      default:
        return <>no container for this vault :(</>;
    }
  }, [selectedVaultIndex, isEdit, publicTokenColData]);

  return VaultTokenDetail;

  //   return <>{isEdit ? VaultTokenDetailEdit : VaultTokenDetail}</>;
};

export default TokenDetail;
