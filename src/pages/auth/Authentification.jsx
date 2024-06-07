import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Title,
} from "@mantine/core";

export default function Authentification() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Welcome back!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
