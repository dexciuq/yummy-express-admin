import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextInput,
  Textarea,
  Select,
  Button,
  Title,
  Group,
  Card,
  Loader,
  Divider,
} from "@mantine/core";
import {
  getOrder,
  updateOrderItem,
  updateOrder,
  getStatuses,
} from "../services/Api";

export default function UpdateOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [updatedOrderItems, setUpdatedOrderItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, statusData] = await Promise.all([
          getOrder(id),
          getStatuses(),
        ]);
        setOrder(orderData.order);
        setOrderItems(orderData.order_items);
        setStatuses(statusData.statuses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateOrderStatus = async (statusId) => {
    try {
      await updateOrder(id, { status_id: statusId });
      navigate(`/order/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOrderItemQuantity = (itemId, quantity) => {
    const parsedQuantity = parseFloat(quantity);
    if (!isNaN(parsedQuantity)) {
      const items = orderItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: parsedQuantity };
        }
        return item;
      });
      setOrderItems(items);
      setUpdatedOrderItems(items);
    }
  };

  const handleUpdateButtonClick = async () => {
    try {
      await Promise.all(
        updatedOrderItems.map((item) =>
          updateOrderItem(item.id, { quantity: item.quantity })
        )
      );
      await updateOrder(id, order);
      navigate(`/orders/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loadersDiv">
        <Loader color="#5FCC55" size="xl" />
      </div>
    );
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <Container>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title
          order={2}
          align="center"
          mb="md"
          style={{
            fontFamily: "Manrope",
            fontWeight: "bolder",
            fontSize: "32px",
          }}
        >
          Edit Order
        </Title>
        <TextInput label="User ID" value={order.user_id} disabled />
        <TextInput label="First Name" value={order.firstname} disabled />
        <TextInput label="Last Name" value={order.lastname} disabled />
        <TextInput label="Email" value={order.email} disabled />
        <Select
          label="Status"
          data={statuses.map((status) => ({
            value: status.id.toString(),
            label: status.name,
          }))}
          value={order.status_id.toString()}
          onChange={(value) =>
            setOrder({ ...order, status_id: parseInt(value) })
          }
        />
        <Textarea
          label="Address"
          value={order.address}
          onChange={(event) =>
            setOrder({ ...order, address: event.target.value })
          }
        />
        <TextInput label="Total" value={order.total} disabled />

        <Divider mt={"xl"} my="md" />

        <Title
          order={3}
          mt="md"
          style={{
            fontFamily: "Manrope",
            fontWeight: "bolder",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Order Items
        </Title>
        {orderItems.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mt="md"
          >
            <TextInput label="Name" value={item.name} disabled />
            <TextInput label="Brand" value={item.brand} disabled />
            <TextInput label="Category" value={item.category} disabled />
            <TextInput label="Country" value={item.country} disabled />
            <TextInput label="Price" value={item.price} disabled />
            <TextInput
              label="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleUpdateOrderItemQuantity(item.id, e.target.value)
              }
            />
            <TextInput label="Subtotal" value={item.subtotal} disabled />
          </Card>
        ))}

        <Group
          position="apart"
          mt={"xl"}
          mb={"md"}
          style={{ justifyContent: "center" }}
        >
          <Button onClick={handleUpdateButtonClick}>Update Order</Button>
        </Group>
      </Card>
    </Container>
  );
}
