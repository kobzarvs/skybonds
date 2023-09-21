import { Button, Group, MultiSelect, Stack, Table } from '@mantine/core';
import { BONDS } from '../../bond-card/db/bonds-db';
import { DateInput } from '@mantine/dates';
import { useEffect, useRef, useState } from 'react';
import { Inspector } from '@observablehq/inspector';
import dayjs from 'dayjs';
import { date as formatDate, usd, vol } from '../../../utils/decorators';
import { loadLsItem, saveLsItem } from '../../../utils/local-storage';
import { getBondsData } from '../services/get-bonds-data';
import { storage } from '../services/storage';

import styles from './styles.module.css';
import './viewer.css';
import { useInputState, useLocalStorage } from '@mantine/hooks';

let objectViewer;


export function BondCachePage() {
    const viewer = useRef();

    const [date, setDate] = useLocalStorage({
        key: 'bonds-cache-date',
        defaultValue: new Date(),
        deserialize: (value) => new Date(JSON.parse(value)),
    });
    const [isins, setIsins] = useLocalStorage({
        key: 'bonds-cache-isins',
        defaultValue: [],
    });
    const [data, setData] = useLocalStorage({
        key: 'bonds-cache-data',
        defaultValue: [],
    });

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
