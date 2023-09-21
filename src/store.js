import { configureStore } from '@reduxjs/toolkit';
import { bondsApi } from './features/bond-card/services/bondsApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { bondsSlice } from './features/bond-card/services/bondsSlice';

export const store = configureStore({
    reducer: {
        bonds: bondsSlice.reducer,
        [bondsApi.reducerPath]: bondsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(bondsApi.middleware);
    },
});

setupListeners(store.dispatch);
