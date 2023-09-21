export function getFirstDayOfRange(endDate, range) {
    let date;
    switch (range) {
        case 'Week':
            date = endDate.subtract(1, 'week');
            break;
        case 'Month':
            date = endDate.subtract(1, 'month');
            break;
        case 'Quarter':
            date = endDate.subtract(3, 'month');
            break;
        case 'Year':
            date = endDate.subtract(1, 'year');
            break;
        case 'Maximum':
            date = endDate.subtract(2, 'year');
            break;
        default:
            return null;
    }
    return date;
}
