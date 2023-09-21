import { rest } from 'msw';
import dayjs from 'dayjs';
import { bondsDb } from '../features/bond-card/db/bonds-db';
import { getFirstDayOfRange } from '../utils/date';

export const handlers = [
    rest.post('/bonds/:date', (req, res, ctx) => {
        const { date } = req.params;
        const isins = JSON.parse(req.body);
        const results = [];

        for (const isin of isins) {
            let bond = bondsDb[date + '.' + isin];
            if (!bond) {
                console.error('data not found in database', date, isin);
            }
            bond && results.push(bond);
        }

        return res(ctx.json(results));
    }),

    rest.get('/bonds/:range/:isin', (req, res, ctx) => {
        const {
            range,
            isin,
        } = req.params;
        const result = [];
        const now = dayjs();
        let date = getFirstDayOfRange(now, range);

        if (!date) {
            // invalid range
            return res(ctx.status(422));
        }

        while (date < now) {
            date = date.add(1, 'day');
            let formattedDate = date.format('YYYYMMDD');
            let bond = bondsDb[formattedDate + '.' + isin];
            if (bond) {
                bond.loadedAt = Date.now();
                result.push(bond);
            }
        }

        return res(ctx.json(result));
    }),
];
