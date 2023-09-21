import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setParameter,
    setSelectedBondIsin,
    setTimeframe,
} from '../../services/bondsSlice';
import { useGetBondByRangeQuery } from '../../services/bondsApi';
import styles from './styles.module.css';
import { BondDetails } from './BondDetails';
import { Paginator } from '../paginator/Paginator';
import { BONDS } from '../../db/bonds-db';
import { usd } from '../../../../utils/decorators';
import { Box, Group, Select, Stack, Title } from '@mantine/core';


const timeframes = ['Week', 'Month', 'Quarter', 'Year', 'Maximum'];

export function BondCard({ updatedAt }) {
    const dispatch = useDispatch();
    const {
        selectedTimeframe,
        selectedParameter,
        selectedBondIsin,
    } = useSelector(state => state.bonds);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const bond = BONDS[selectedBondIsin];

    let {
        data,
        refetch,
    } = useGetBondByRangeQuery({
        range: selectedTimeframe,
        isin: selectedBondIsin,
    }, {
        refetchOnMountOrArgChange: true,
    });
    const total = data?.length ?? 0;

    const prevPage = () => {
        setPage(Math.max(0, page - 1));
    };

    const nextPage = () => {
        setPage(Math.min(Math.ceil(total / pageSize) - 1, page + 1));
    };

    const setPageSizeHandler = (size) => {
        setPageSize(size);
        setPage(0);
    };

    useEffect(() => {
        if (!data?.length) {
            setPage(0);
        } else {
            setPage(Math.min(Math.ceil(total / pageSize) - 1, page));
        }
    }, [data?.length]);

    useEffect(() => {
        refetch();
    }, [page, pageSize, updatedAt]);

    return (
        <div>
            <Stack m="auto" w={800} justify="center" align="stretch" gap={5}>
                <Stack w={750} align="flex-start">
                    <Group>
                        <Title order={1}>{bond.name}</Title>
                        <Title order={1} data-dir={bond.dir}>
                            {usd(bond.currentPrice)}
                        </Title>
                    </Group>

                    <Group w="100%" justify="space-between">
                        <Group gap={10}>
                            <label>Select Bond</label>
                            <Select
                                value={selectedBondIsin}
                                onChange={(value) => dispatch(setSelectedBondIsin(value))}
                                data={Object.values(BONDS).map(bond => ({
                                    value: bond.isin,
                                    label: bond.name,
                                }))}
                            />
                        </Group>
                        <Group gap={0}>
                            {timeframes.map(timeframe => (
                                <button
                                    key={timeframe}
                                    className={styles.button}
                                    data-active={selectedTimeframe === timeframe}
                                    onClick={() => dispatch(setTimeframe(timeframe))}
                                >
                                    {timeframe}
                                </button>
                            ))}
                        </Group>
                    </Group>
                </Stack>

                <div style={{
                    position: 'relative',
                    width: '100%',
                }}
                >
                    <ReactECharts
                        style={{
                            width: 900,
                            height: 350,
                            padding: 0,
                            margin: 0,
                            marginLeft: -50,
                        }}
                        option={{
                            xAxis: {
                                type: 'category',
                                data: data?.length ? data.map(item => item.label.slice(0, 5)) : ['no data'],
                            },
                            yAxis: {
                                type: 'value',
                            },
                            series: [
                                {
                                    data: data?.length ? data.map(item => +item[selectedParameter]) : [0],
                                    type: 'line',
                                },
                            ],
                        }}
                    />

                    <Select
                        value={selectedParameter}
                        className={styles.parameters}
                        onChange={(value) => dispatch(setParameter(value))}
                        data={[
                            {
                                value: 'price',
                                label: 'Price',
                            },
                            {
                                value: 'yield',
                                label: 'Yield',
                            },
                            {
                                value: 'spread',
                                label: 'Spread',
                            },
                            {
                                value: 'volume',
                                label: 'Volume',
                            },
                        ]}
                        w={100}
                    />
                </div>

                <Paginator
                    page={page}
                    total={total}
                    pageSize={pageSize}
                    onChangePage={setPage}
                    onPrevPage={prevPage}
                    onNextPage={nextPage}
                    onChangePageSize={setPageSizeHandler}
                />

                <BondDetails
                    data={data?.slice(page * pageSize, page * pageSize + pageSize)}
                    page={page}
                    offset={page * pageSize}
                />
            </Stack>

            <Box h={100}/>
        </div>
    );
}
