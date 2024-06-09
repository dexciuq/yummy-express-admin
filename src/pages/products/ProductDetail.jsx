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
  const [discountActive, setDiscountActive] = useState(false);

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

  useEffect(() => {
    if (product) {
      const isActiveDiscount = () => {
        if (product.discount_percent == 0 || product.discount_id == 0) {
          setDiscountActive(false);
        } else {
          let startDate = new Date(product.discount_started_at);
          let endDate = new Date(product.discount_ended_at);
          let currentDate = new Date();

          // console.log('Start Date:', startDate);
          // console.log('End Date:', endDate);
          // console.log('Current Date:', currentDate);

          if (currentDate >= startDate && currentDate <= endDate) {
            setDiscountActive(true);
          } else {
            setDiscountActive(false);
          }
        }
      };

      isActiveDiscount();
    }
  }, [product]);

  if (!product) {
    return (
      <div className="loadersDiv">
        <Loader color="#5FCC55" size="xl" />
      </div>
    );
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

  const formatPrice = (price, isDiscountAcive) => {
    let priceWithDiscount = price;
    if (isDiscountAcive) {
      priceWithDiscount = ((100 - product.discount_percent) * price) / 100;
    }
    let tenge = Math.floor(price / 100);
    let tiyn = price % 100;
    let answer = `${tenge}.${tiyn.toString().padStart(2, "0")}`;
    if (isDiscountAcive) {
      tenge = Math.floor(priceWithDiscount / 100);
      tiyn = priceWithDiscount % 100;
      answer = `(${answer}) ${tenge}.${tiyn.toString().padStart(2, "0")}`;
    }
    answer += "₸";
    return answer;
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
              <Title ta="center" order={1} className={classes.title}>
                {product.name}
              </Title>
              <Text
                ta="center"
                size="xl"
                weight={700}
                className={classes.price}
              >
                {formatPrice(product.price, discountActive)}
              </Text>
              <Title ta="center" order={2} className={classes.title}>
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
                    <strong>Discount:</strong> {product.discount_name} (
                    {discountActive ? "Active" : "Not active"})
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

              <Group mt={"xl"}>
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
