import {getSharesPercentageGenerator, getArrayFromGenerator} from './shares.mjs';


const shares = ['1.5', '3', '6', '1.5'];

try {
    console.log('Shares:', shares);
    const percentages = getArrayFromGenerator(getSharesPercentageGenerator, shares, 3);
    console.log('Result:', percentages);
} catch (error) {
    console.error(error.message);
}
