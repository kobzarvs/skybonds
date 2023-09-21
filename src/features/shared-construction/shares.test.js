import {
    getArrayFromGenerator,
    getSharesPercentageGenerator,
} from "./shares.mjs";

describe('Shared counstruction', () => {
    describe('convertToPercentageBigGenerator', () => {
        it('should correctly convert fractions to percentages', () => {
            const fractions = ['1.5', '3', '6', '1.5'];
            const percentages = getArrayFromGenerator(getSharesPercentageGenerator, fractions);
            expect(percentages).toEqual(['12.500', '25.000', '50.000', '12.500']);
        });

        it('should throw error for zero sum of fractions', () => {
            const fractions = ['0', '0', '0', '0'];
            expect(() => getArrayFromGenerator(getSharesPercentageGenerator, fractions))
                .toThrow("Total sum of fractions is zero.");
        });

        it('should throw error for non-string fractions', () => {
            const fractions = [0.5, '3', '6', '1.5'];
            expect(() => getArrayFromGenerator(getSharesPercentageGenerator, fractions))
                .toThrow("Each fraction should be a string.");
        });

        it('should throw error for invalid number string', () => {
            const fractions = ['a', '3', '6', '1.5'];
            expect(() => getArrayFromGenerator(getSharesPercentageGenerator, fractions))
                .toThrow("Invalid number: a");
        });

        it('should handle large numbers without loss of precision', () => {
            let fractions = ['123456789123456789.123', '123456789123456789.123'];
            let percentages = getArrayFromGenerator(getSharesPercentageGenerator, fractions);
            expect(percentages).toEqual(['50.000', '50.000']);

            fractions = ['0.333', '0.333', '0.333'];
            percentages = getArrayFromGenerator(getSharesPercentageGenerator, fractions);
            expect(percentages).toEqual(['33.333', '33.333', '33.333']);
        });
    });

    describe('getArrayFromGenerator', () => {
        it('should convert generator to array', () => {
            function* simpleGenerator() {
                yield 1;
                yield 2;
                yield 3;
            }

            const result = getArrayFromGenerator(simpleGenerator);
            expect(result).toEqual([1, 2, 3]);
        });

        it('should handle empty generators', () => {
            function* emptyGenerator() {
            }

            const result = getArrayFromGenerator(emptyGenerator);
            expect(result).toEqual([]);
        });
    });
});
