import dayjs from 'dayjs';
import { BONDS, bondsDb, indexeddb } from './bonds-db';

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}

let id = 0;

export function generateBondsData(prev) {
    // цена от 500 до 1500
    const price = +Math.abs(((prev ? prev.price : rnd(500, 1500)) + rnd(-80, 80))).toFixed(2);

    // процентный доход от 1% до 15%
    const bondYield = +Math.abs(((prev ? prev.yield : rnd(1, 15)) + rnd(-5, 5))).toFixed(2);

    // разница между ставками от 0.1% до 5%
    const spread = +Math.abs(((prev ? prev.spread : rnd(0.1, 5)) + rnd(-0.5, .5))).toFixed(2);

    // объем торгов от 1000 до 6000
    const volume = +Math.abs(Math.floor((prev ? prev.volume : rnd(1000, 6000))) + Math.floor(rnd(-100, 100))).toFixed(2);

    return {
        id: id++,
        price,
        volume,
        yield: bondYield,
        spread,
    };
}

export async function createDataset(reset, controller = new AbortController()) {
    return new Promise(async (finish, abort) => {
        controller.signal.onabort = abort;
        const db = indexeddb.db;
        const transaction = db.transaction(['requests'], 'readwrite', { durability: 'relaxed' });
        const store = transaction.objectStore('requests');

        // Для синхронизации асинхронных и синхронных операций
        const mutex = { countSync: 0, countAsync: 0, done: false };

        let now = dayjs();
        Object.keys(BONDS).forEach(isin => {
            let date = now.subtract(3, 'year');
            let prev = null;

            while (date < now) {
                date = date.add(1, 'day');
                const formattedDate = date.format('YYYYMMDD');
                let bond = {
                    isin,
                    date: formattedDate,
                    name: BONDS[isin].name,
                    currentPrice: BONDS[isin].currentPrice,
                    label: (date.month() === 0 && date.day() === 0) ? date.format('YYYY') : date.format('DD.MM.YYYY'),
                    createdAt: Date.now(),
                    ...generateBondsData(prev),
                }

                if (reset) {
                    // Генерация новых данных
                    mutex.countSync++;
                    bondsDb[formattedDate + '.' + isin] = bond;
                    store.put(bond);
                    prev = bond;
                    mutex.countSync--;
                } else {
                    mutex.countAsync++;

                    // Пытаемся получить данные из IndexedDB
                    const getRequest = store.get([formattedDate, isin]);

                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            // Если данные получены, то обновляем их
                            bond = {
                                ...bond,
                                ...getRequest.result
                            };
                        }
                        bondsDb[formattedDate + '.' + isin] = bond;
                        prev = bond;
                        mutex.countAsync--;

                        if (mutex.countAsync === 0 && mutex.done) {
                            console.log('async create dataset complete');
                            finish(Date.now());
                        }
                    };

                    getRequest.onerror = () => console.error(getRequest.error);
                }
            }
        });
        mutex.done = true;

        if (mutex.countSync === 0 && mutex.countAsync === 0 && mutex.done) {
            console.log('sync create dataset complete');
            finish(Date.now());
        }

        // TODO: debug
        window.generatedBonds = bondsDb;
    });
}
