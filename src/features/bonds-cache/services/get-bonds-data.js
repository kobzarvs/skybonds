import { saveLsItem } from '../../../utils/local-storage';
import { storage } from './storage';

export const getBondsData = async ({
    date,
    isins,
}) => {
    const results = [];
    const notFoundIsins = new Set();

    isins.forEach((isin) => {
        // ищем в in-memory cache
        const item = storage.cache[date + '.' + isin];
        if (item) {
            item.src = 'Cache';
        } else {
            notFoundIsins.add(isin);
        }
    });

    const res = await fetch(`/bonds/${date}`, {
        method: 'POST',
        body: JSON.stringify([...notFoundIsins]),
    });

    const freshData = await res.json();

    isins.forEach((isin) => {
        const bond = storage.cache[date + '.' + isin] ?? freshData[isin];
        // сохраняем/перезаписываем в in-memory cache
        storage.cache[date + '.' + isin] = bond;
        bond.src ||= 'Network';
        results.push(bond);
    });

    freshData?.length && saveLsItem('bonds-cache', storage);

    return results;
};
