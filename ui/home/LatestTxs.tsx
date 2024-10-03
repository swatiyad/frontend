import { Box, CardFooter, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import { TX } from 'stubs/tx';
import LinkInternal from 'ui/shared/links/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  const { num, socketAlert } = useNewTxsSocket();

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    const bgColor = useColorModeValue('#E9EAEC', 'black');
    const textColor =useColorModeValue('#000', '#fff')
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box mb={ 3 } display={{ base: 'none', lg: 'block' }} maxHeight="416px"   
        overflowY="auto">
            { data.slice(0, txsCount).map(((tx, index) => (
              <LatestTxsItem
                key={ tx.hash + (isPlaceholderData ? index : '') }
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </Box>
        </AddressHighlightProvider>
        <CardFooter borderTopWidth={'1px'} p={2}>
        <Flex  
         bg={bgColor} 
         width={'100%'}
         justifyItems={'center'}
         boxShadow="sm" 
         borderRadius="3px"
         justifyContent="center"
         p={2}
         >
          <LinkInternal fontSize="sm" textAlign={'center'} width={'100%'} 
          color={textColor}
          href={ txsUrl }>View all transactions</LinkInternal>
        </Flex>
        </CardFooter>
      </>
    );
  }

  return null;
};

export default LatestTransactions;