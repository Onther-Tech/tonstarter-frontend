import {Flex, Box, Text, Button, useColorMode} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PageHeader} from 'components/PageHeader';
import {Project} from './components/Projects/Project';
import {useModal} from 'hooks/useModal';
import CreateRewardsProgramModal from './components/modals/CreateRewardsProgram';
import DownloadModal from './components/modals/Download';
import {useRouteMatch} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectLaunch, setHashKey} from '@Launch/launch.reducer';
const ProjectScreen = () => {
  const {openAnyModal} = useModal();
  const history = useHistory();
  const {colorMode} = useColorMode();

  const goBackToList = useCallback(() => {
    history.push('/opencampaign');
  }, []);
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[3];
  const dispatch = useAppDispatch();
  // console.log(window.location);

  const {
    //@ts-ignore
    params: {name},
  } = match;
  const {
    data: {projects, hashKey},
  } = useAppSelector(selectLaunch);

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  useEffect(() => {
    dispatch(setHashKey({data: isExist === 'project' ? undefined : isExist}));
  }, []);
  const project = projects[name];
  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
      mb={'100px'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Project'}
          subtitle={'Make Your Own Token and Create Token Economy'}
        />
        <Flex mt={'60px'} mb={'50px'}>
          <Project project={project} />
        </Flex>
        <Button
          w={'180px'}
          h={'45px'}
          bg={'#257eee'}
          fontSize={'14px'}
          color={'#fff'}
          _hover={{
            background: 'transparent',
            border: 'solid 1px #2a72e5',
            color: themeDesign.tosFont[colorMode],
            cursor: 'pointer',
          }}
          _active={{
            background: '#2a72e5',
            border: 'solid 1px #2a72e5',
            color: '#fff',
          }}
          //   onClick={() => openAnyModal('Launch_CreateRewardProgram', {})}
          onClick={() => goBackToList()}>
          Back to List
        </Button>
      </Flex>
      <CreateRewardsProgramModal />
      <DownloadModal />
    </Flex>
  );
};

export default ProjectScreen;
