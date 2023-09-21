import { Group, Pagination, Select } from '@mantine/core';

export const Paginator = ({
    page,
    pageSize,
    total,
    onChangePage,
    onPrevPage,
    onNextPage,
    onChangePageSize,
}) => {
    return <Group w="100%" justify="space-between" align="end" mb={10}>
        <Pagination
            value={page}
            total={Math.ceil(total / pageSize) - 1}
            onNextPage={onNextPage}
            onPreviousPage={onPrevPage}
            onChange={onChangePage}
        />

        <Group align="center">
            <span>Page size</span>

            <Select
                value={pageSize}
                onChange={(value) => onChangePageSize(+value)}
                data={['10', '25', '50']}
                w="100px"
            />
        </Group>
    </Group>;
};
