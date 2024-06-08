import React from "react";
import { Container, Title, Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import classes from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Title className={classes.title}>Page Not Found</Title>
        <Text color="dimmed" size="lg" align="center" className={classes.text}>
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <Group className={classes.group} positicenteron="">
          <Button
            color="green"
            onClick={() => navigate("/")}
            className={classes.button}
          >
            Go to Home
          </Button>
        </Group>
      </Container>
    </div>
  );
}
