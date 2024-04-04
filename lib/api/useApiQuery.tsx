import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueries } from '@tanstack/react-query';

import type { ResourceError, ResourceName, ResourcePayload } from './resources';
import type { Params as ApiFetchParams } from './useApiFetch';
import useApiFetch from './useApiFetch';

export interface Params<R extends ResourceName, E = unknown> extends ApiFetchParams<R> {
  queryOptions?: Omit<UseQueryOptions<ResourcePayload<R>, ResourceError<E>, ResourcePayload<R>>, 'queryKey' | 'queryFn'>;
}

export function getResourceKey<R extends ResourceName>(resource: R, { pathParams, queryParams }: Params<R> = {}) {
  if (pathParams || queryParams) {
    return [ resource, { ...pathParams, ...queryParams } ];
  }

  return [ resource ];
}

export default function useApiQuery<R extends ResourceName, E = unknown>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams }: Params<R, E> = {},
) {
  const apiFetch = useApiFetch();

  return useQuery<ResourcePayload<R>, ResourceError<E>, ResourcePayload<R>>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: getResourceKey(resource, { pathParams, queryParams }),
    queryFn: async() => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      return apiFetch(resource, { pathParams, queryParams, fetchParams }) as Promise<ResourcePayload<R>>;
    },
    ...queryOptions,
  });
}

export type QueryData<R extends ResourceName> = {
  resource: R;
  params: Params<R, unknown>;
};

// FIXME
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApiQueries(queriesData: Array<any>) {
  const apiFetch = useApiFetch();

  return useQueries({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queries: queriesData.map(q => ({
      queryKey: getResourceKey(q.resource, { pathParams: q.params.pathParams, queryParams: q.params.queryParams }),
      queryFn: (async() => {
        // all errors and error typing is handled by react-query
        // so error response will never go to the data
        // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
        return apiFetch(q.resource, {
          pathParams: q.params.pathParams,
          queryParams: q.params.queryParams,
          fetchParams: q.params.fetchParams,
        });
      }),
      ...q.params.queryOptions,
    })),
  });
}
