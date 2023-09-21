import { Button, Group, MultiSelect, Stack, Table } from '@mantine/core';
import { BONDS } from '../../bond-card/db/bonds-db';
import { DateInput } from '@mantine/dates';
import { useEffect, useRef, useState } from 'react';
import { Inspector } from '@observablehq/inspector';
import dayjs from 'dayjs';
import { date as formatDate, usd, vol } from '../../../utils/decorators';
import styles from './styles.module.css';
import './viewer.css';


let _cache = { cache: {} };

try {
    _cache = JSON.parse(localStorage.getItem('bonds-cache')) ?? _cache;
} catch (e) {
    //
}

const storage = _cache;


let objectViewer;

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

    freshData?.length && localStorage.setItem('bonds-cache', JSON.stringify(storage));

    return results;
};


export function BondCachePage() {
    const viewer = useRef();
    let _date;
    let _isins;
    let _data;

    try {
        _date = JSON.parse(localStorage.getItem('bonds-cache-date'));
        _date = _date ? new Date(_date) : new Date();
        _isins = JSON.parse(localStorage.getItem('bonds-cache-isins')) ?? [];
        _data = JSON.parse(localStorage.getItem('bonds-cache-data')) ?? [];
    } catch (e) {
        _date = new Date();
        _isins = [];
        _data = [];
    }

    const [date, setDate] = useState(_date);
    const [isins, setIsins] = useState(_isins);
    const [data, setData] = useState(_data);

    useEffect(() => {
        localStorage.setItem('bonds-cache-data', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        localStorage.setItem('bonds-cache-isins', JSON.stringify(isins));
    }, [isins]);

    useEffect(() => {
        localStorage.setItem('bonds-cache-date', JSON.stringify(date));
    }, [date]);

    useEffect(() => {
        if (!viewer.current) return;

        objectViewer = new Inspector(viewer.current);
        objectViewer.fulfilled(storage);
    }, [viewer.current]);

    const runQuery = async () => {
        const results = await getBondsData({
            date: dayjs(date).format('YYYYMMDD'),
            isins,
        });
        objectViewer.fulfilled(storage);
        setData(results);
    };

    console.log('isins', isins, 'date', dayjs(date).format('YYYYMMDD'));

    return (
        <Group justify="flex-start" align="start">
            <MultiSelect
                checkIconPosition="left"
                data={Object.entries(BONDS).map(([value, bond]) => ({
                    value,
                    label: bond.name,
                }))}
                w="100%"
                label="Bonds"
                placeholder="Pick bonds"
                onChange={(value) => {
                    setIsins(value);
                }}
                value={isins}
            />
            <Group align="end">
                <DateInput
                    valueFormat="YYYYMMDD"
                    label="Date input"
                    placeholder="Date input"
                    clearable={true}
                    maxDate={new Date()}
                    minDate={dayjs().subtract(2, 'year').toDate()}
                    value={date}
                    onChange={(value) => {
                        setDate(value);
                        console.log('onDateChange', value);
                    }}
                />

                <Button onClick={() => runQuery()}>
                    Run query
                </Button>
            </Group>

            <Stack w="100%" className={styles.objectViwer}>
                <div ref={viewer}></div>

                <Table.ScrollContainer minWidth={500} type="native">
                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>name</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Yield</Table.Th>
                                <Table.Th>Spread</Table.Th>
                                <Table.Th>Volume</Table.Th>
                                <Table.Th>Source</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data?.map((item, i) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>{i + 1}</Table.Td>
                                    <Table.Td>{formatDate(item.date)}</Table.Td>
                                    <Table.Td>{item.name}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{usd(item.price)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{usd(item.yield)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{usd(item.spread)}</Table.Td>
                                    <Table.Td>{vol(item.volume)}</Table.Td>
                                    <Table.Td style={{
                                        textAlign: 'right',
                                        color: item.src === 'Cache' ? 'green' : 'red',
                                    }}
                                    >
                                        {item.src}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Stack>
        </Group>
    );
}

window.dayjs = dayjs;
