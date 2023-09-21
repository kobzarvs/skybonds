export const usd = (num) => Number(num).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
});
export const vol = (num) => Number(num).toLocaleString('ru-RU', { maximumSignificantDigits: 3 });
export const date = (d) => [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].join('-');
