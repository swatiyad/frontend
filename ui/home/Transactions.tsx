import { Box, Card, CardHeader, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useHasAccount from 'lib/hooks/useHasAccount';
import LatestOptimisticDeposits from 'ui/home/latestDeposits/LatestOptimisticDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';

import LatestArbitrumDeposits from './latestDeposits/LatestArbitrumDeposits';

const rollupFeature = config.features.rollup;

const TAB_LIST_PROPS = {
  mb: { base: 3, lg: 3 },
};


const TransactionsHome = () => {
  const hasAccount = useHasAccount();
  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || hasAccount) {
    const tabs = [
      { id: 'txn', title: 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestArbitrumDeposits/> },
      hasAccount && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <Heading as="h4" size="sm" mb={ 3 }>Transactions</Heading>
        <TabsWithScroll tabs={ tabs } lazyBehavior="keepMounted" tabListProps={ TAB_LIST_PROPS }/>
      </>
    );
  }
  const borderTheme = useColorModeValue('#eee', '#333');
  return (
    <>
      <Card
      borderWidth="1px"           
      borderRadius="md"           
      boxShadow="md"
      borderColor={borderTheme}             
      // p={4}
      flexShrink={0}  
      
        
      >
     <CardHeader borderBottomWidth={'1px'}>
       <Heading as="h5" size="sm" fontWeight={'bold'} mb={ 0 }>Latest transactions</Heading>
     </CardHeader>
      <LatestTxs/>
      </Card>
    </>
  );
};

export default TransactionsHome;
