import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Title,
  Group,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail, IconLock } from "@tabler/icons-react";
import classes from "./Authentification.module.css";
import { useNavigate } from "react-router-dom";

export default function Authentification() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must have at least 8 characters",
    },
  });

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        setMessage(error.message);
      } else {
        console.error("Unknown error occurred during login");
      }
    }
  };

  return (
    <Container className={classes.container}>
      <Paper
        withBorder
        p={30}
        shadow="md"
        radius="md"
        className={classes.paper}
      >
        <Title align="center" className={classes.title}>
          Welcome back!
        </Title>
        <form mt="xl" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email Address"
            placeholder="you@example.com"
            icon={<IconMail size={16} />}
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            required
            className={classes.input}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            icon={<IconLock size={16} />}
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password && "Password must have at least 8 characters"
            }
            required
            mt="md"
            className={classes.input}
          />
          <Group position="apart" mt="md">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              size="xs"
              onClick={handleForgotPassword}
              className={classes.anchor}
            >
              Forgot password?
            </Anchor>
          </Group>
          {message && <div className="error-notification">{message}</div>}
          <Button type="submit" fullWidth mt="xl" className={classes.button}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
