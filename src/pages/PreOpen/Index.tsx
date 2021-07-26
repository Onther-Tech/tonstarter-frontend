import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {Flex, Text, Image, Container, useTheme, Center} from '@chakra-ui/react';
import logoDark from 'assets/svgs/fldw_bi.svg';

const whiteWithOpacity = `rgba(255, 255, 255, 0.5)`;

const TextComponent = (props: any) => {
  const {
    header,
    content,
    contentWidth,
    borderColor,
    mainFontSize,
    subFontSize,
    ...rest
  } = props;
  return (
    <Center
      w={'100%'}
      height="170px"
      flexDirection="column"
      alignContent="center"
      alignItems="left"
      pr={'0.750em'}
      pl={'1.250em'}
      borderTopWidth={1}
      borderColor={borderColor === undefined ? whiteWithOpacity : borderColor}
      {...rest}>
      <Text
        fontSize={mainFontSize === undefined ? '1.125em' : mainFontSize}
        fontWeight={'bold'}>
        {header}
      </Text>
      <Text
        w={contentWidth}
        h="0.75em"
        fontSize={subFontSize === undefined ? '0.625em' : subFontSize}
        fontWeight={300}
        opacity={0.75}>
        {content}
      </Text>
    </Center>
  );
};

export const MobilePreOpen = () => {
  const theme = useTheme();

  return (
    <Fragment>
      <Head title={'TON Starter'} />
      <Flex
        bg={'blue.200'}
        w={'100%'}
        flexDir={'column'}
        pt={'1.875em'}
        fontFamily={theme.fonts.fld}
        color="white.100">
        <Image src={logoDark} w={'11.875em'} pl={'1.250em'} />
        <Flex
          mt={'97px'}
          flexDir="column"
          alignItems="center"
          justifyContent="center">
          <Flex
            w={'19.125em'}
            mb={'128px'}
            flexDir="column"
            alignItems="center"
            fontSize={'1.813em'}
            fontWeight={600}>
            <Text>
              <span style={{color: '#ffff07'}}>TON Starter</span> is optimized
            </Text>
            <Text>on the web</Text>
            <Text>Mobile is</Text>
            <Text>not supported yet</Text>
          </Flex>

          {/* <Text fontSize={'3.438em'} fontWeight={600} mb={'103px'}>
            10D 22:40:24
          </Text> */}
          <Flex w={'100%'}>
            <Container
              w={'50%'}
              p={0}
              borderRightWidth={1}
              borderRightColor={whiteWithOpacity}>
              <TextComponent
                header="Dual Profit"
                content="generated from the platform growth and individual projects"
                contentWidth={'133px'}></TextComponent>
              <TextComponent
                header="Permissionless"
                content="Fair Opportunity to participation and rewards"
                contentWidth={'141px'}></TextComponent>
              <TextComponent
                header="Transparent"
                content="TOS holders can participate in all 
platform decisions by staking TON 
into sTOS(staked TOS)"
                contentWidth={'148px'}></TextComponent>
              <TextComponent
                fontFamily={theme.fonts.openSans}
                mainFontSize="0.875em"
                subFontSize="0.688em"
                header="ONTHER PTE. LTD."
                content="© 2021 Onther"></TextComponent>
              <Text
                pos="absolute"
                left="20px"
                bottom="1.875em"
                color="#ffff07"
                fontSize="0.688em"
                opacity={0.7}
                fontFamily={theme.fonts.openSans}>
                E. info@onther.io
              </Text>
            </Container>
            <Container pos="relative" w={'50%'} p={0}>
              <Text
                pos="absolute"
                p={0}
                pl={'20px'}
                top={'1.250em'}
                fontSize={'1.125em'}>
                ROAD MAP
              </Text>
              <TextComponent
                header="Phase1"
                content="TOS Liquidity Mining Launch"></TextComponent>
              <TextComponent
                borderColor="blue.200"
                header="Phase2"
                content=" TOS staking, LP staking"
                contentWidth={'99px'}></TextComponent>
              <TextComponent
                borderColor="blue.200"
                contentWidth={'121px'}
                header="Phase3"
                content="Project Starter Open TONStarter Governance"></TextComponent>
              <TextComponent
                borderColor="blue.200"
                contentWidth={'110px'}
                header="Phase4"
                content="Tokamak Network Layer2 Integration"></TextComponent>
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Fragment>
  );
};
