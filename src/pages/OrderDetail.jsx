import { useState, useEffect } from "react";
import { Container, Image, Title, Text, Group, Card, Grid, Divider, Loader, Timeline, Accordion, Button } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../services/Api";
import { IconPackage, IconTruckDelivery, IconHome, IconX, IconPackageOff } from '@tabler/icons-react';

const statuses = [
    { id: 1, name: "Ordered", description: "The order has been successfully placed by the customer.", icon: <IconPackage size={16} /> },
    { id: 2, name: "Processing", description: "The order is being prepared, which may include packaging and other necessary preparations.", icon: <IconPackageOff size={16} /> },
    { id: 3, name: "Shipped", description: "The order has been dispatched from the warehouse and is on its way.", icon: <IconTruckDelivery size={16} /> },
    { id: 4, name: "Delivered", description: "The order has been successfully delivered to the customer.", icon: <IconHome size={16} /> },
    { id: 5, name: "Cancelled", description: "The order has been cancelled by either the customer or the seller.", icon: <IconX size={16} /> }
];

const statusColors = {
    ordered: 'blue',
    processing: 'orange',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
};

function OrderTimeline({ statusId }) {
    const currentStatusIndex = statuses.findIndex(status => status.id === statusId);

    const timelineItems = statuses.filter((status, index) => {
        if (status.id === 5) {
            return statusId === 5 || index <= currentStatusIndex;
        }
        return index <= currentStatusIndex || statusId !== 5;
    });

    return (
        <Timeline active={currentStatusIndex} bulletSize={24} lineWidth={2}>
            {timelineItems.map((status, index) => {
                const color = index === currentStatusIndex ? statusColors[status.name.toLowerCase()] : 'gray';
                const lineVariant = index <= currentStatusIndex ? "solid" : "dashed";
                return (
                    <Timeline.Item
                        key={status.id}
                        bullet={status.icon}
                        title={status.name}
                        lineVariant={lineVariant}
                        color={color}
                    >
                        <Text color="dimmed" size="sm">{status.description}</Text>
                    </Timeline.Item>
                );
            })}
        </Timeline>
    );
}

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOrder(id);
                setOrder(data.order);
                setOrderItems(data.order_items);
                console.log("Fetched order", data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="loadersDiv"><Loader color="#5FCC55" size="xl" /></div>;
    }

    if (!order) {
        return <div>No order found</div>;
    }

    const formatPrice = (price) => {
        const tenge = Math.floor(price / 100);
        const tiyn = price % 100;
        return `${tenge}.${tiyn.toString().padStart(2, "0")}`;
    };

    const parseAddress = (address) => {
        const parts = address.split('. ');
        const parsedAddress = {
            address: parts[0].replace("Address: ", ""),
            apartment: parts[1].replace("Apartment: ", ""),
            entrance: parts[2].replace("Entrance: ", ""),
            floor: parts[3].replace("Floor: ", "")
        };
        return parsedAddress;
    };

    const { address, apartment, entrance, floor } = parseAddress(order.address);

    return (
        <div style={{paddingBottom: "30px"}}>
            <Container>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={2} align="center" mb="md">Order Details</Title>
                    <Grid>
                        <Grid.Col span={12} md={6}>
                            <Text size="lg"><strong>ID:</strong> {order.id}</Text>
                            <Text size="lg"><strong>User ID:</strong> {order.user_id}</Text>
                            <Text size="lg"><strong>User name:</strong> {order.firstname} {order.lastname}</Text>
                            <Text size="lg"><strong>User email:</strong> {order.email}</Text>
                            <Text size="lg"><strong>Status:</strong> {order.status_name}</Text>
                            <Text size="lg"><strong>Status Description:</strong> {order.status_description}</Text>
                            <Text size="lg"><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</Text>
                            <Text size="lg"><strong>Delivered At:</strong> {order.delivered_at === "0001-01-01T00:00:00Z" ? "Not Delivered Yet" : new Date(order.delivered_at).toLocaleString()}</Text>
                            <Text size="lg"><strong>Address:</strong> {address}</Text>
                            <Text size="lg"><strong>Apartment:</strong> {apartment}</Text>
                            <Text size="lg"><strong>Entrance:</strong> {entrance}</Text>
                            <Text size="lg"><strong>Floor:</strong> {floor}</Text>
                            <Text size="lg"><strong>Total:</strong> {formatPrice(order.total)} KZT</Text>
                            <Divider my="md" />
                            <Button color="#5FCC55" size="lg" fullWidth onClick={() => navigate(`/update-order/${id}`)}>Edit</Button>
                        </Grid.Col>
                        <Grid.Col span={12} md={6}>
                            <Title order={3} mb="md">Order Status</Title>
                            <OrderTimeline statusId={order.status_id} />
                        </Grid.Col>
                    </Grid>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
                    <Title order={3} mb="md">Order Items</Title>
                    <Accordion variant="separated" defaultValue={orderItems.length > 0 ? orderItems[0].id.toString() : null}>
                        {orderItems.map((item) => (
                            <Accordion.Item key={item.id} value={item.id.toString()}>
                                <Accordion.Control icon={<Image src={item.image} alt={item.name} width={24} height={24} fit="contain" />}>{item.name}</Accordion.Control>
                                <Accordion.Panel>
                                    <Group position="apart">
                                        <Image src={item.image} alt={item.name} width={100} height={100} fit="contain" />
                                        <div>
                                            <Text size="lg"><strong>Name:</strong> {item.name}</Text>
                                            <Text size="lg"><strong>UPC:</strong> {item.upc}</Text>
                                            <Text size="lg"><strong>Brand:</strong> {item.brand}</Text>
                                            <Text size="lg"><strong>Category:</strong> {item.category}</Text>
                                            <Text size="lg"><strong>Country:</strong> {item.country}</Text>
                                            <Text size="lg"><strong>Price:</strong> {formatPrice(item.subtotal/item.amount)} KZT</Text>
                                            <Text size="lg"><strong>Quantity:</strong> {item.amount}</Text>
                                            <Text size="lg"><strong>Subtotal:</strong> {formatPrice(item.subtotal)} KZT</Text>
                                        </div>
                                    </Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Card>
            </Container>
        </div>
    );
}
