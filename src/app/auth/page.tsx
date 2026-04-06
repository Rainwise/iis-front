"use client";
// Mantine Imports
import {
  Box,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// Style Imports
import { IconLogin2 } from "@tabler/icons-react";

//Hook Imports
import { useAuthContext } from "@/hooks/providers/useAuthContext";

export default function LoginFromPage() {
  const { login, loading } = useAuthContext();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (value.length < 1 ? "Username is required" : null),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  const onLoginSubmit = async (values: typeof form.values) => {
    await login(values.username, values.password);
  };

  return (
    <Box>
      <Flex mb={"xl"} align={"center"} direction={"column"}>
        <Text size="28px" fw={700} c="var(--mantine-color-text-0)">
          {"IIS Project"}
        </Text>
        <Text size="md" fw={400} c="dimmed" mt={"sm"}>
          {"Enter your details to login."}
        </Text>
      </Flex>
      <form onSubmit={form.onSubmit((values) => onLoginSubmit(values))}>
        <TextInput
          label="Username"
          placeholder="Please enter your username"
          {...form.getInputProps("username")}
          withAsterisk
          mb="lg"
          size="lg"
        />

        <PasswordInput
          label="Password"
          placeholder="Please enter your password"
          {...form.getInputProps("password")}
          withAsterisk
          size="lg"
        />

        <Button
          mt={"xl"}
          leftSection={<IconLogin2 size={20} />}
          type="submit"
          size="lg"
          color="var(--mantine-color-violet-8)"
          w={"100%"}
          bdrs={"md"}
          loading={loading}
          disabled={loading}
        >
          {"Login"}
        </Button>
      </form>
    </Box>
  );
}
