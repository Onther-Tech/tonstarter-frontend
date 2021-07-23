import {Box, Container, Flex, Link, Text, useTheme} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
// import emailIcon from 'assets/svgs/email.svg';
import {IconTelegram} from './Icons/IconTelegram';
import {IconGithub} from './Icons/IconGithub';
import {IconMedium} from './Icons/IconMedium';
import {IconTwitter} from './Icons/IconTwitter';
import {EmailIcon} from '@chakra-ui/icons';
const socialLinks = [
  {
    title: 'Telegram',
    icon: IconTelegram,
    href: 'https://t.me/TONStarter_ANN',
    isExternal: true,
  },
  // {
  //   title: 'Discord',
  //   icon: DiscordIcon,
  //   href: 'https://discord.gg/8wSpJKz',
  //   isExternal: true,
  // },
  {
    title: 'GitHub',
    icon: IconGithub,
    href: 'https://github.com/Onther-Tech/',
    isExternal: true,
  },
  {
    title: 'Twitter',
    icon: IconTwitter,
    href: 'https://twitter.com/tonstarter',
    isExternal: true,
  },
  {
    title: 'Medium',

    icon: IconMedium,
    href: 'https://medium.com/onther-tech/https-medium-com-onther-tech-tos/home',
    isExternal: true,
  },
  // {
  //   title: 'Youtube',
  //   icon: YoutubeIcon,
  //   href: 'https://www.youtube.com/channel/UCF6vtIKF_0QQVRG983czVEQ/',
  //   isExternal: true,
  // },
];
type SocialLinkProps = {
  colorMode: string;
};
const SocialLinks: React.FC<SocialLinkProps> = ({colorMode}) => {
  return (
    <Flex direction={'row'} mr={3}>
      {socialLinks.map((socialLink, index) => (
        <Link
          href={socialLink.href}
          isExternal={socialLink.isExternal}
          mr={{base: 4, lg: 6}}
          key={index}>
          <socialLink.icon />
        </Link>
      ))}
    </Flex>
  );
};

export const Footer = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const bgColor = colorMode === 'light' ? 'gray.50' : 'black.200';
  return (
    <Container
      maxW={'full'}
      bg={bgColor}
      pl={'2.5em'}
      pr={'2.5em'}
      pos="absolute"
      bottom={0}>
      <Flex
        flexDirection={{base: 'column', md: 'row'}}
        justifyContent={'space-between'}
        alignItems={'center'}
        h={76}>
        <Flex
          flexGrow={2}
          direction={{base: 'column', md: 'row'}}
          alignItems={'center'}>
          <Box mr={{base: 0, md: 5}}>
            <Text
              color={colorMode === 'light' ? 'gray.225' : 'white.100'}
              fontWeight={600}
              fontSize={14}
              fontFamily={theme.fonts.body}
              letterSpacing={'normal'}>
              ONTHER PTE.LTD
            </Text>
          </Box>
          <Box mr={3} py={{base: 4, md: 0}}>
            <Text
              color={colorMode === 'light' ? 'gray.175' : 'white.100'}
              fontSize={13}
              fontFamily={theme.fonts.body}
              fontWeight={'normal'}>
              111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
            </Text>
          </Box>
          <Box mr={{base: 0, md: 3}}>
            <EmailIcon
              color={
                colorMode === 'light' ? '#84919e' : 'white.100'
              }></EmailIcon>
          </Box>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              fontSize={13}
              fontFamily={theme.fonts.body}
              fontWeight={'normal'}>
              hello@tokamak.network
            </Text>
          </Box>
        </Flex>
        <Box maxW={'full'}>
          <Flex
            py={{base: 4, md: 0}}
            grow={2}
            direction={{base: 'column', lg: 'row'}}
            justifyContent={'flex-end'}>
            <SocialLinks colorMode={colorMode} />
            {/* <Flex
              py={{base: 4, lg: 0}}
              justifyContent={{base: 'flex-start', lg: 'center'}}>
              <Text>[Dropdown here]</Text>
            </Flex> */}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};
