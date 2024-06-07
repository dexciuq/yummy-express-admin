import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Title,
} from "@mantine/core";
import "./App.css";
import { useState } from "react";

function App() {
  return (
    <MantineProvider>
      <Login />
    </MantineProvider>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container size={420} my={40}>
      <Title align="center">Welcome back!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form>
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
};

export default App;
