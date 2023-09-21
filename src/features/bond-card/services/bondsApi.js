import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { cached } from './bondsSlice';

export const bondsApi = createApi({
    reducerPath: 'bondsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/bonds',
    }),
    endpoints: (builder) => ({
        getBondByRange: builder.query({
            query: ({
                range,
                isin,
            }) => ({
                method: 'GET',
                url: `/${range}/${isin}`,
            }),
            async onCacheEntryAdded(arg, api) {
                const result = await api.cacheDataLoaded;
                setTimeout(() => {
                    api.dispatch(cached(result.data));
                }, 1000);
            },
        }),
    }),
});

export const {
    useGetBondByRangeQuery,
    useGetBondsByDateQuery,
} = bondsApi;
