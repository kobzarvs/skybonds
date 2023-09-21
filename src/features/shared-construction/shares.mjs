/*
 * Функция-генератор принимает массив долей в виде строк и точность вычисления.
 * Возвращает генератор, который отдает элементы с процентными значениями долей.
 *
 * - Генератор позволяет сэкономить память в случаях когда на входе
 *   очень большой массив долей, который нельзя мутировать и не хочется
 *   создавать его колию в памяти, а например нужно только пробежаться
 *   по нему и вывести результат.
 *
 * - Для общей суммы долей используется BigInt, на случай если массив будет
 *   огромным и сумма будет выходить за пределы базопасных для вычислений
 *   значений.
 *
 * Для работы с дробями можно было бы использовать библиотеку Fraction.js.
 */
export function* getSharesPercentageGenerator(fractions, precision = 3) {
    if (!Array.isArray(fractions)) {
        throw new Error("Input should be an array.");
    }

    // Множитель для избавления от дробной части с заданной точностью
    const scalingFactor = 10 ** precision;

    // BigInt если массив будет огромным и сумма долей будет очень большой
    let scaledTotalBig = 0n;

    if (!Array.isArray(fractions)) {
        throw new Error("Input should be an array.");
    }

    for (const fraction of fractions) {
        if (typeof fraction !== 'string') {
            throw new Error("Each fraction should be a string.");
        }

        const num = parseFloat(fraction);
        if (isNaN(num)) {
            throw new Error(`Invalid number: ${fraction}`);
        }

        // Суммируем доли с учетом точности
        scaledTotalBig += BigInt(Math.round(num * scalingFactor));
    }


    if (scaledTotalBig === 0n) {
        throw new Error("Total sum of fractions is zero.");
    }

    const scalingFactorBig = BigInt(scalingFactor);
    for (const fraction of fractions) {
        // Для вычисления процентов также учитываем точность
        const percentage = BigInt(Math.round(+fraction * scalingFactor)) * scalingFactorBig * 100n / scaledTotalBig;

        yield (Number(percentage) / scalingFactor).toFixed(precision);
    }
}


/*
 * Получение нового массива из генератора
 */
export function getArrayFromGenerator(generatorFunc, ...args) {
    const results = [];
    const generator = generatorFunc(...args);

    for (const value of generator) {
        results.push(value);
    }

    return results;
}
