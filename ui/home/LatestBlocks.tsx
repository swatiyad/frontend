import { chakra, Box, Heading, Flex, VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  Skeleton,
  CardHeader,
  Card,
  CardFooter,
  useColorModeValue, } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import LinkInternal from 'ui/shared/links/LinkInternal';

import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 7;
  } else {
    blocksMaxCount = isMobile ? 2 : 7;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
    },
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload the page.</Text>;
  }
  const borderTheme = useColorModeValue('#eee', '#333');
  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);
    const bgColor = useColorModeValue('#E9EAEC', 'black');
    const textColor =useColorModeValue('#000', '#fff')

    content = (
      <>
        {/* <VStack spacing={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
          <AnimatePresence initial={ false } >
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (isPlaceholderData ? String(index) : '') }
                block={ block }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </AnimatePresence>
        </VStack> */}
      <Box height="445px"   
        overflowY="auto" >
        <Table variant="unstyled">        
          <Tbody>
            <AnimatePresence initial={false}>
              {data.map((block, index) => (
                <LatestBlocksItem key={block.height + (isPlaceholderData ? String(index) : '')}
                block={block} 
                isLoading={isPlaceholderData} 
                />
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </Box>

    <CardFooter borderTopWidth={'1px'} justifyContent="center" p={2}>
        <Flex
         
          bg={bgColor}
          width={'100%'}
          boxShadow="sm" 
          borderRadius="3px" 
          p={2}
          >
            <LinkInternal fontSize="sm"  width={'100%'} 
            color={textColor}
            textAlign={'center'} href={ route({ pathname: '/blocks' }) }>View all blocks</LinkInternal>
        </Flex>
    </CardFooter>
      </>
    );
  }

  return (
    <Card  
        
        width={{ base: '100%', lg: '50%' }} 
        // flexShrink={ 0 }
        borderWidth="1px"           
        borderRadius="md"           
        boxShadow="md"    
        borderColor={borderTheme}         
        // p={3}   
                
      >
         <CardHeader borderBottomWidth={'1px'}>
          <Heading as="h5" size="14px" fontWeight={'bold'}>Latest blocks</Heading>
         </CardHeader>     
      { statsQueryResult.data?.network_utilization_percentage !== undefined && (
        <Skeleton isLoaded={ !statsQueryResult.isPlaceholderData } mt={ 1 } display="inline-block">
          <Text as="span" fontSize="sm">
              Network utilization:{ nbsp }
          </Text>
          <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 700 }>
            { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
          </Text>
        </Skeleton>
      ) }
      { statsQueryResult.data?.celo && (
        <Box whiteSpace="pre-wrap" fontSize="sm">
          <span>Current epoch: </span>
          <chakra.span fontWeight={ 700 }>#{ statsQueryResult.data.celo.epoch_number }</chakra.span>
        </Box>
      ) }
      <Box mt={ 3 }>
        { content }
      </Box>
    </Card>
  );
};

export default LatestBlocks;
