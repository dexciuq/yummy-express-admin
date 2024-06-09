import { useState, useEffect } from 'react';
import { getOrders } from "../services/Api.js";
import {
    ActionIcon,
    Badge,
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    rem,
    keys,
    Loader,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconInfoCircle} from '@tabler/icons-react';//, IconPencil, IconTrash
import classes from './OrderList.module.css';
import {useNavigate} from "react-router-dom";


const formatPrice = (price) => {
    const tenge = Math.floor(price / 100);
    const tiyn = price % 100;
    return `${tenge}.${tiyn.toString().padStart(2, "0")}₸`;
};

/**
 * @typedef {Object} RowData
 * @property {string} user_id
 * @property {string} name
 * @property {string} email
 * @property {string} company
 */

/**
 * @typedef {Object} ThProps
 * @property {React.ReactNode} children
 * @property {boolean} reversed
 * @property {boolean} sorted
 * @property {function(): void} onSort
 */

/**
 * @param {ThProps} props
 */
function Th({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

/**
 * @param {RowData[]} data
 * @param {string} search
 * @returns {RowData[]}
 */
function filterData(data, search) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => {
            const value = item[key];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(query);
            }
            return false;
        })
    );
}


/**
 * @param {RowData[]} data
 * @param {{ sortBy: keyof RowData | null; reversed: boolean; search: string }} payload
 * @returns {RowData[]}
 */
function sortData(data, payload) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            // Ensure that a[sortBy] and b[sortBy] are strings
//            console.log(a[sortBy], typeof a[sortBy])
            let valueA = a[sortBy]
            let valueB = b[sortBy]
            if(typeof a[sortBy] === 'string') {
                if (payload.reversed) {
                    return valueB.localeCompare(valueA);
                }

                return valueA.localeCompare(valueB);
            }else{
                if (payload.reversed) {
                    return valueB - valueA; // Compare as numbers
                }

                return valueA - valueB; // Compare as numbers
            }
            // let valueA = typeof a[sortBy] === 'string' ? a[sortBy] : '';
            // let valueB = typeof b[sortBy] === 'string' ? b[sortBy] : '';
            //
            // if (/^\d+$/.test(valueA) && /^\d+$/.test(valueB)) {
            //     console.log(valueA,"is int")
            //     valueA = parseInt(valueA, 10);
            //     valueB = parseInt(valueB, 10);
            //     if (payload.reversed) {
            //         return valueB - valueA; // Compare as numbers
            //     }
            //
            //     return valueA - valueB; // Compare as numbers
            // }

            // if (payload.reversed) {
            //     return valueB.localeCompare(valueA);
            // }
            //
            // return valueA.localeCompare(valueB);
        }),
        payload.search
    );
}


const statusColors = {
    ordered: 'blue',
    processing: 'orange',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
};


export default function OrderList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            console.log('Fetched orders:', data.orders);
            if (data && data.orders) {
                setOrders(data.orders);
                setSortedData(data.orders); // Set initial sorted data
            } else {
                console.error("Invalid response format:", data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const setSorting = (field) => {
        console.log("set Sorting", field)
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(orders, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(orders, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((order) => (
        <Table.Tr key={order.id}>
            <Table.Td>{order.id}</Table.Td>
            <Table.Td>
                <Group gap="sm">
                    <div>
                        <Text fz="sm" fw={500}>
                            {order.firstname} {order.lastname}
                        </Text>
                        <Text fz="xs" c="dimmed">
                            {order.email}
                        </Text>
                    </div>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text
                    // lineClamp={1}
                >
                    {order.address}
                </Text>
            </Table.Td>
            <Table.Td>{formatPrice(order.total)}</Table.Td>
            <Table.Td>
                <Badge color={statusColors[order.status_name.toLowerCase()]} variant="light">
                    {order.status_name}
                </Badge>
            </Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle" color="gray" onClick={() => navigate(`/orders/${order.id}`)}>
                    <IconInfoCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
                {/*<div className="dropdown">*/}
                {/*    <button*/}
                {/*        className="btn btn-secondary"*/}
                {/*        type="button"*/}
                {/*        id="dropdownMenuButton"*/}
                {/*        data-toggle="dropdown"*/}
                {/*        aria-haspopup="true"*/}
                {/*        aria-expanded="false"*/}
                {/*        style={{*/}
                {/*            backgroundColor: "#5FCC55",*/}
                {/*            border: "none",*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <i className="fa-solid fa-ellipsis" />*/}
                {/*    </button>*/}
                {/*    <div*/}
                {/*        className="dropdown-menu"*/}
                {/*        aria-labelledby="dropdownMenuButton"*/}
                {/*    >*/}
                {/*        <div*/}
                {/*            className="dropdown-item"*/}
                {/*            style={{*/}
                {/*                cursor: 'default',*/}
                {/*            }}*/}
                {/*            onClick={() => navigate(`/orders/${order.id}`)}*/}
                {/*        >*/}
                {/*            Get information*/}
                {/*        </div>*/}
                {/*        <div*/}
                {/*            className="dropdown-item"*/}
                {/*            style={{*/}
                {/*                cursor: 'default',*/}
                {/*            }}*/}
                {/*            onClick={() => onEdit(product.id)}*/}
                {/*        >*/}
                {/*            Update*/}
                {/*        </div>*/}
                {/*        <div*/}
                {/*            className="dropdown-item"*/}
                {/*            style={{*/}
                {/*                cursor: 'default',*/}
                {/*            }}*/}
                {/*            onClick={() => handleMenuClick()}*/}
                {/*        >*/}
                {/*            Delete*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea style={{ margin: "50px" }}>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            {loading && <div className="loadersDiv"><Loader color="#5FCC55" size="xl" /></div>}
            <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                // miw={700}
                // layout="fixed"
                striped highlightOnHover withTableBorder withColumnBorders
            >
                <Table.Thead>
                    <Table.Tr>
                        <Th
                            sorted={sortBy === 'id'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('id')}
                        >
                            ID
                        </Th>
                        <Th
                            sorted={sortBy === 'email'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('email')}
                        >
                            User
                        </Th>
                        <Th
                            sorted={sortBy === 'address'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('address')}
                        >
                            Address
                        </Th>
                        <Th
                            sorted={sortBy === 'total'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('total')}
                        >
                            Total
                        </Th>
                        <Th
                            sorted={sortBy === 'status_name'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('status_name')}
                        >
                            Status
                        </Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={5}>
                                <Text fw={500} ta="center">
                                    Nothing found
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}
