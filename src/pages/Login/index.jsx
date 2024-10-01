import React from 'react';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import classes from './AuthenticationTitle.module.css';

function LoginPage () {

  document.title = 'Mublin';

  return (
      <>
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Bem-vindo ao Mublin!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Ainda não tem cadastro?{' '}
          <Anchor size="sm" component="button">
            Criar conta
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Sign in
          </Button>
        </Paper>
        <Text c="dimmed" size="sm" ta="center" mt={20}>
          <Anchor size="sm" component="button">
            Voltar à home
          </Anchor>
        </Text>
      </Container>
    </>
    );
};

export default LoginPage;