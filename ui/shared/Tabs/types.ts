import type React from 'react';

import type { ResourceName } from 'lib/api/resources';
import type { QueryData } from 'lib/api/useApiQuery';

export interface TabItem {
  id: string;
  title: string | (() => React.ReactNode);
  count?: number | null;
  component: React.ReactNode;
  prefetchQueries?: Array<QueryData<ResourceName>>;
}

export type RoutedTab = TabItem & { subTabs?: Array<string> }

export type RoutedSubTab = Omit<TabItem, 'subTabs'>;

export interface MenuButton {
  id: null;
  title: string;
  count?: never;
  component: null;
}
