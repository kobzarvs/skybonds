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
            results.push(item);
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

    freshData.forEach((item) => {
        // сохраняем в in-memory cache
        storage.cache[date + '.' + item.isin] = item;
        item.src = 'Network';
        results.push(item);
    });

    freshData?.length && saveLsItem('bonds-cache', storage);

    return results;
};
