import { createSlice } from '@reduxjs/toolkit';

import { BONDS } from '../db/bonds-db';

const initialState = {
    cache: {},
    selectedTimeframe: localStorage.getItem('BONDS_selectedTimeframe') ?? 'Month',
    selectedParameter: localStorage.getItem('BONDS_selectedParameter') ?? 'price',
    selectedBondIsin: localStorage.getItem('BONDS_selectedBondIsin') ?? Object.keys(BONDS)[0],
};

export const bondsSlice = createSlice({
    name: 'bonds',
    initialState,
    reducers: {
        setTimeframe: (state, action) => {
            state.selectedTimeframe =  action.payload;
            localStorage.setItem('BONDS_selectedTimeframe', action.payload);
        },
        setParameter: (state, action) => {
            state.selectedParameter = action.payload;
            localStorage.setItem('BONDS_selectedParameter', action.payload);
        },
        setSelectedBondIsin: (state, action) => {
            state.selectedBondIsin = action.payload;
            localStorage.setItem('BONDS_selectedBondIsin', action.payload);
        },
        cached: (state, action) => {
            action.payload.forEach((rec) => {
                state.cache[rec.date + '.' + rec.isin] = true;
            });
        }
    },
});

export const {
    cached,
    setTimeframe,
    setParameter,
    setSelectedBondIsin,
} = bondsSlice.actions;
