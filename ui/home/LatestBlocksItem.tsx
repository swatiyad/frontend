import {
  Box,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  Text,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  block: Block;
  isLoading?: boolean;
}

const LatestBlocksItem = ({ block, isLoading }: Props) => {
  const totalReward = getBlockTotalReward(block);
  const textColor = useColorModeValue('blue.600', 'white');

  return (
    <Tr as={motion.tr} 
    initial={{ opacity: 0 }}
     animate={{ opacity: 1 }} 
     exit={{ display: 'none' }} 
     transitionDuration="normal"
      transitionTimingFunction="linear"
      // borderRadius="md"
      // border="1px solid"
      // borderColor="divider"
      p={ 2 }
      >
      <Td>
        <BlockEntity
          isLoading={isLoading}
          number={block.height}
          tailLength={2}
          fontSize="sm"
          lineHeight={7}
          fontWeight={500}
        />
        { block.celo?.is_epoch_block && (
          <Tooltip label={ `Finalized epoch #${ block.celo.epoch_number}`}>
            <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" ml={2} isLoading={isLoading} />
          </Tooltip>
        ) }
        <TimeAgoWithTooltip
          timestamp={block.timestamp}
          enableIncrement={!isLoading}
          isLoading={isLoading}
          color="text_secondary"
          fontWeight={400}
          display="inline-block"
          fontSize="sm"
          ml={7}
        />
      </Td>
      {/* <Td>
       
        <Skeleton isLoaded={!isLoading} color="text_secondary">
          <span> {block.tx_count}</span>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}> <Text fontSize="14px">Txn</Text></Skeleton>
      </Td> */}

      { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
        <>
          {/* <Td>
            <Skeleton isLoaded={!isLoading}>Reward</Skeleton>
          </Td> */}
          {/* <Td>
          <Skeleton isLoaded={!isLoading}> <Text fontSize="14px">Reward</Text></Skeleton>
            <Skeleton isLoaded={!isLoading} color="text_secondary">
              <span>{totalReward.dp(10).toFixed()}</span>
            </Skeleton>
          </Td> */}
        </>
      )}

      { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
        <>
          {/* <Td>
            <Skeleton isLoaded={!isLoading} 
              textTransform="capitalize">
              {getNetworkValidatorTitle()}
            </Skeleton>
          </Td> */}
          <Td>
           <HStack gap={'0.2rem'}> 
           <Skeleton isLoaded={!isLoading}>
            <Text fontSize={'14px'}>Fee Recipient</Text>
         
         <AddressEntity
           address={block.miner}
           isLoading={isLoading}
           noIcon
           noCopy
           truncation="constant"
           fontSize={'14px'}
         />
           </Skeleton></HStack>
         
       
         <Skeleton isLoaded={!isLoading}> <Text fontSize="14px">{block.tx_count} txns</Text></Skeleton>
          </Td>

          <Td textAlign="right">
            <Skeleton isLoaded={!isLoading} color={textColor}>
              <Text 
                fontSize="12px" 
                border="1px solid #ccc" 
                borderRadius="3px" 
                p={2} 
                display="inline-block"
                fontWeight={'bold'}
              >
                0.15 DSC
              </Text>
            </Skeleton>
          </Td>

        </>
      )}
    </Tr>
  );
};

export default LatestBlocksItem;