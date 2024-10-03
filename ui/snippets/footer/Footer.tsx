import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, Link, VStack, Skeleton, useColorModeValue, Image, Icon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import telegram from 'icons/social/telega.svg';
import facebook from 'icons/social/facebook_filled.svg';
import twitter from 'icons/social/twitter.svg';
import upArrow from 'icons/arrows/up-head.svg';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import { copy } from 'lib/html-entities';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 3;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;


const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);

  const logoColor = useColorModeValue('blue.600', 'white');
  const iconColor = useColorModeValue('black', 'white');

  const BLOCKSCOUT_LINK_GROUPS = [
    {
      title: 'Company',
      links: [
        { text: 'Community Website', url: 'https://dsclab.ai/' },
        { text: 'Terms of Service', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Contribute', url: 'https://github.com/blockscout/blockscout' },
        { text: 'Newsletter', url: '#' },
      ],
    },
   
    {
      title: 'Products & Services',
      links: [
        { text: 'Blockscan Chat', url: '#' },
      ],
    },
  ];

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link>;
    }

    if (config.UI.footer.frontendCommit) {
      return <Link href={ FRONT_COMMIT_URL } target="_blank">{ config.UI.footer.frontendCommit }</Link>;
    }

    return null;
  })();9

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  // const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
  //   return (
  //     <Flex
  //       gridArea={ gridArea }
  //       flexWrap="wrap"
  //       columnGap={ 8 }
  //       rowGap={ 6 }
  //       mb={{ base: 5, lg: 10 }}
  //       _empty={{ display: 'none' }}
  //     >
  //       { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
  //       <NetworkAddToWallet/>
  //     </Flex>
  //   );
  // }, []);

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box 
      // gridArea={ gridArea }
      >
        {/* <Flex columnGap={ 2 } fontSize="xs" lineHeight={ 5 } alignItems="center" color="text">
          <span>Made with</span>
          <Link href="#" isExternal display="inline-flex" color={ logoColor } _hover={{ color: logoColor }}>
            <IconSvg
              name="networks/logo-placeholder"
              width="80px"
              height={ 4 }
            />
          </Link>
        </Flex> */}

          <Flex columnGap={ 2 } lineHeight={ 5 } alignItems="center" color="text">
          
          <Link href="#" isExternal display="inline-flex" color={ logoColor } _hover={{ color: logoColor }}>          
            <Image
                src="https://dscscan.io/images/dscscanlogo.png" 
                alt="DSC Chain Logo" 
                width="40px" 
                height="auto"
               
              />            
          </Link>
          <Text fontSize="18px" lineHeight="5" ml={2}>Powered by DSC Chain</Text>
        </Flex> 
        <Box mt={ 3 }>
          <NetworkAddToWallet />
        </Box>
        <Text mt={ 3 } fontSize="xs">
        Dscscan is a Block Explorer and Analytics Platform for DSC chain, a decentralized smart contracts platform.
        </Text>
        {/* <Box mt={ 6 } alignItems="start" fontSize="xs" lineHeight={ 5 }>
          { apiVersionUrl && (
            <Text>
              Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text>
              Frontend: { frontendLink }
            </Text>
          ) }
          <Text>
            Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
          </Text>
        </Box> */}
      </Box>
    );
  }, [logoColor ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'solid',
  };

  // const contentProps: GridProps = {
  //   px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
  //   py: { base: 4, lg: 8 },
  //   gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
  //   columnGap: { lg: '32px', xl: '100px' },
  //   maxW: `${ CONTENT_MAX_WIDTH }px`,
  //   m: '0 auto',
  // };

  const contentProps = {
    // px: { base: 4, lg: 12 },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: '1fr 2fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: '1450px',
    m: '0 auto',
  };

  if (config.UI.footer.links) {
    return (
      // <Box { ...containerProps }>
      <Box as="footer" borderTopWidth="1px" borderTopColor="solid">
        <Grid { ...contentProps }>
          <div>
            {/* { renderNetworkInfo() } */}
            { renderProjectInfo() }
          </div>
          {/* Right side: Menu Links in 3 columns */}
          
          <Grid
          gap={{ base: 6, lg: 8, xl: 12 }}
          gridTemplateColumns={{ base: 'repeat(3, 1fr)' }} 
          justifyContent="flex-end"
          mt={{ base: 8, lg: 0 }}
        >
          {BLOCKSCOUT_LINK_GROUPS.map((linkGroup) => (
            <Box key={linkGroup.title}>
              <Text fontWeight={500} mb={3}>
                {linkGroup.title}
              </Text>
              <VStack spacing={1} alignItems="start">
                {linkGroup.links.map((link) => (
                  <FooterLinkItem key={link.text} text={link.text} url={link.url} />
                ))}
              </VStack>
            </Box>
          ))}
        </Grid>

          
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <Flex justifyContent="space-between" alignItems="center" mb={6} py={3} >
       {/* Social Media Links */}
       <Flex>
          <Link href="https://t.me/dscblockchainsupport" isExternal>
            <Icon as={ telegram } color= {iconColor} mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
          </Link>
          <Link href="https://www.instagram.com/dscblockchain?igsh=MW8xdTdrbnBhOWRkYw==" isExternal>
            <Icon as={ facebook } color= {iconColor} mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
          </Link>
          <Link href="https://x.com/DSC_Blockchain" isExternal>
            <Icon as={ twitter } color= {iconColor} mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
          </Link>
        </Flex>
      
         <Link onClick={scrollToTop} fontSize="sm" fontWeight="bold" color={logoColor} _hover={{ textDecoration: 'underline' }}>
        
         <Text color= {iconColor}>  <Icon as={ upArrow } mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>  Back to Top </Text>
        </Link>
      </Flex>
      <Grid
        { ...contentProps }
        // gridTemplateAreas={{
        //   lg: `
        //   "network links-top"
        //   "info links-bottom"
        // `,
        // }}
      >

        {/* { renderNetworkInfo({ lg: 'network' }) } */}
        { renderProjectInfo({ lg: 'info' }) }

        <Grid
          gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: 'repeat(3, 135px)',
            xl: 'repeat(3, 160px)',
           }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { 
              BLOCKSCOUT_LINK_GROUPS.map((linkGroup) => (
                <Box key={linkGroup.title}>
                  <Text fontWeight={500} mb={3}>{linkGroup.title}</Text>
                  <VStack spacing={1} alignItems="start">
                    {linkGroup.links.map(link => (
                      <FooterLinkItem key={link.text} text={link.text} url={link.url} />
                    ))}
                  </VStack>
                </Box>
              ))
            }
          </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);