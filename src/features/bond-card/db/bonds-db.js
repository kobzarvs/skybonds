import { DEFAULT_BONDS } from './bonds-list';

export const bondsDb = {};
window.bondsDb = bondsDb;
export const BONDS = loadBondsFromLS();
export const indexeddb = { db: null };


function loadBondsFromLS() {
    try {
        const bonds = JSON.parse(localStorage.getItem('BONDS'));
        if (Object.keys(bonds).length !== 5) {
            throw new Error('bad data');
        }
        return bonds;
    } catch (e) {
        localStorage.setItem('BONDS', JSON.stringify(DEFAULT_BONDS));
        return DEFAULT_BONDS;
    }
}

// Инициализация IndexedDB
export async function initDB() {
    return new Promise(resolve => {
        const request = indexedDB.open('cacheDB', 5);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('requests')) {
                db.createObjectStore('requests', { keyPath: ['date', 'isin'] });
            }
        };
        request.onerror = (event) => {
            console.log('Ошибка при открытии DB', event);
        };
        request.onsuccess = (event) => {
            indexeddb.db = event.target.result;
            resolve();
        };
    });
}
