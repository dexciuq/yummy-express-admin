import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "../../assets/ic_logo.png";
import classes from "./Home.module.css";

export default function Home() {
  return (
    <Container className={classes.container}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>Yummy Express</Title>
          <Text c="dimmed" mt="xl">
            This platform makes it easier for users to browse, select and order
            products, turning their mobile phones into a one-stop shop to meet
            all their household needs
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon color="green" size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item mt="xl">
              <b>Convenience at Your Fingertips </b> – Order from a wide variety
              of restaurants and cuisines, and have your favorite meals
              delivered right to your doorstep with just a few taps on your
              mobile device.
            </List.Item>
            <List.Item mt="xl">
              <b>Fast delivery</b> – Stay updated with order tracking, from the
              moment you place your order until it arrives at your door,
              ensuring transparency and timely delivery.
            </List.Item>
            <List.Item mt="xl">
              <b>Exclusive Deals and Discounts</b> – Enjoy special offers,
              discounts, and loyalty rewards through food delivery platforms,
              making your dining experience not only convenient but also
              economical.
            </List.Item>
          </List>

          <Group mt={50}>
            <Button
              radius="xl"
              color="green"
              size="md"
              className={classes.control}
            >
              Get started
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Observe
            </Button>
          </Group>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}
