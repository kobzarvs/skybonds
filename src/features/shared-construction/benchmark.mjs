import {
    getSharesPercentageGenerator,
    getArrayFromGenerator,
} from './shares.mjs';


const testData = [
    ['1.5', '3', '6', '1.5'],
    ['1.5', '3', '6', '1.5', '1.5', '3', '6', '1.5', '1.5', '9.123'],
    Array.from({length: 1_000_000}, () => Math.round(Math.random() * 50000 / 1000).toFixed(3))
];

/*
    Execution Time for 4 elements: 0.18ms
    Execution Time for 10 elements: 0.031ms
    Execution Time for 1000000 elements: 498.776ms
 */
testData.forEach((data) => {
    const label = `Execution Time for ${data.length} elements`;
    console.time(label);
    getArrayFromGenerator(getSharesPercentageGenerator, data);
    console.timeEnd(label);
});
