import { useState, useEffect } from "react";
import {
  Container,
  Image,
  Title,
  Text,
  Group,
  Card,
  Grid,
  Divider,
  Button,
  Loader,
  Modal,
} from "@mantine/core";
import {
  IconDiscount2,
  IconPackage,
  IconStar,
  IconBarcode,
  IconBox,
  IconBadgeTm,
  IconFlag,
} from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./ProductDetail.module.css";
import { deleteProduct, getProduct } from "../../services/Api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <Loader size="xl" />;
  }

  const handleMenuClick = () => {
    setModalOpened(true);
    console.log(
      `Clicked for product: ${product.name}, modal opened: ${modalOpened}`
    );
  };

  const handleDelete = async () => {
    const response = await deleteProduct(id);
    console.log(response.message);
    navigate("/products");
  };

  const formatPrice = (price) => {
    const tenge = Math.floor(price / 100);
    const tiyn = price % 100;
    return `${tenge}.${tiyn.toString().padStart(2, "0")}₸`;
  };

  return (
    <>
      <Container className={classes.container}>
        <Card shadow="lg" padding="lg" radius="lg" className={classes.card}>
          <Grid>
            <Grid.Col span={12} md={6}>
              <Image
                src={product.image}
                alt={product.name}
                radius="lg"
                className={classes.productImage}
                width={200}
                height={200}
                fit="contain"
              />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <Title order={1} className={classes.title}>
                {product.name}
              </Title>
              <Text size="xl" weight={700} className={classes.price}>
                {formatPrice(product.price)}
              </Text>
              <Title order={2} className={classes.title}>
                <img
                  src={product.category_image}
                  alt={product.category_name}
                  className={classes.categoryImage}
                />
                {product.category_name}
              </Title>
              <Text size="lg" className={classes.description}>
                {product.description}
              </Text>

              <Divider my="md" />

              <Group direction="column" spacing="md" className={classes.group}>
                <Group spacing="xs">
                  <IconBarcode size={20} />
                  <Text size="lg">
                    <strong>UPC:</strong> {product.upc}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconBox size={20} />
                  <Text size="lg">
                    <strong>Quantity:</strong> {product.quantity}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconPackage size={20} />
                  <Text size="lg">
                    <strong>Step:</strong> {product.step}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconDiscount2 size={20} />
                  <Text size="lg">
                    <strong>Discount:</strong> {product.discount_name}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconStar size={20} />
                  <Text size="lg">
                    <strong>Unit:</strong> {product.unit_name}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconBadgeTm size={20} />
                  <Text size="lg">
                    <strong>Brand:</strong> {product.brand_name}
                  </Text>
                </Group>
                <Divider />
                <Group spacing="xs">
                  <IconFlag size={20} />
                  <Text size="lg">
                    <strong>Country:</strong> {product.country_name}
                  </Text>
                </Group>
              </Group>

              <Group>
                <Button
                  color="blue"
                  onClick={() => {
                    navigate(`/update-product/${id}`);
                  }}
                  className={classes.button}
                >
                  Update
                </Button>
                <Button
                  color="red"
                  onClick={() => handleMenuClick()}
                  className={classes.button}
                >
                  Delete
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text style={{ fontSize: "24px" }}>Delete</Text>}
        centered
      >
        <div>
          <Text>
            Are you sure you want to delete this product? Name: {product.name}
          </Text>
          <Button color="red" mt="md" onClick={() => handleDelete()}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
