import React from 'react';
import { date as formatDate, usd, vol } from '../../../../utils/decorators';
import { useSelector } from 'react-redux';
import { Table } from '@mantine/core';


export const BondDetails = ({
    data,
    offset,
}) => {
    const cache = useSelector(state => state.bonds.cache);

    if (!data) return <h1>No data</h1>;

    return (
        <Table w="100%" highlightOnHover withTableBorder withColumnBorders>
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
                            color: item.inCache ? 'green' : '#c00 ',
                        }}
                        >
                            {item.inCache ? 'RTK Cache' : 'Network'}
                        </Table.Td>
                    </Table.Tr>
                ))}

            </Table.Tbody>
        </Table>
    );
};
