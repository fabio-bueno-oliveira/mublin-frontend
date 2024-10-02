import React from 'react';
import { useLocation  } from 'react-router';
import {
  Alert,
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Space,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import Header from '../../components/public/header';
import { IconCheck } from '@tabler/icons-react';

function LoginPage () {

  document.title = 'Mublin';

  const search = useLocation().search;
  const urlInfo = new URLSearchParams(search).get("info");

  return (
      <>
      <Header />
      <Container size={420} my={40}>
        {urlInfo === "firstAccess" &&
          <Alert 
            variant="light" 
            color="green" 
            title="Cadastro efetuado com sucesso!" 
            icon={<IconCheck />}
            mb='md'
          >
            Para acessar, digite abaixo os dados de login
          </Alert>
        }
        <Title ta="center" order={1}>
          Login
        </Title>
        <Text c="dimmed" size="md" ta="center" mt={5}>
          Ainda não tem cadastro?{' '}
          <Anchor size="md" component="button">
            Criar conta
          </Anchor>
        </Text>
        <Space h="lg" />
        <form>
          <TextInput 
            label="Nome de usuário ou email" 
            placeholder="seu@email.com" 
            size="lg"
          />
          <PasswordInput 
            label="Senha" 
            placeholder="Digite sua senha" 
            size="lg" 
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox defaultChecked label="Lembrar meus dados" />
            <Anchor component="button" size="md">
              Esqueci a senha
            </Anchor>
          </Group>
          <Button 
            fullWidth 
            size='lg' 
            color='violet' 
            mt='xl'
            disabled
          >
            Entrar
          </Button>
        </form>
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