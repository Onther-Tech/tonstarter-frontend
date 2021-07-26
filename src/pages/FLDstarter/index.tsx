import {
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Button,
  Center,
} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {TokenComponent} from './TokenComponent';
import {Animation} from './Animation';
import {IconTopArrow} from 'components/Icons/IconTopArrow';
import {useAppSelector} from 'hooks/useRedux';
import {selectStakes} from '../Staking/staking.reducer';
import {LoadingComponent} from 'components/Loading';

export const FLDstarter = () => {
  // const [selected, setSelected] = useState<string>('hi');

  // const select = (selectedItem: string) => {
  //   setSelected(selectedItem);
  // }

  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);

  return (
    <Fragment>
      <Head title={'TON Starter'} />
      <Animation></Animation>
      <Stack>
        <Container maxW={'6xl'} py={12}>
          <SimpleGrid minChildWidth={350} gap={30}>
            {loading === 'pending' || data.length === 0 ? (
              <Center>
                <LoadingComponent />
              </Center>
            ) : (
              data.map((item, index) => (
                <TokenComponent
                  key={index}
                  data={item}
                  phase={item.name}
                  status={item.status}
                  period={item.period}
                  token={item.token}
                  stakedAmount={item.stakeBalanceTON}
                  contractAddress={item.contractAddress}
                  account={item.account}
                  index={index}
                  ept={item.ept}
                />
              ))
            )}
          </SimpleGrid>
        </Container>
        <Flex justifyContent={'flex-end'} pr={10}>
          <Button
            variant="unstyled"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <IconTopArrow />
          </Button>
        </Flex>
      </Stack>
    </Fragment>
  );
};
