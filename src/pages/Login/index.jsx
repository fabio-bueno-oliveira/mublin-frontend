import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation  } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
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
  Notification
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import Header from '../../components/header/public';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function LoginPage () {

  document.title = 'Mublin';

  const search = useLocation().search;
  const urlInfo = new URLSearchParams(search).get("info");
  let dispatch = useDispatch();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: ''
    },

    validate: {
      password: isNotEmpty('Informe a senha')
    },
  });

  const loggingIn = useSelector(state => state.authentication.loggingIn);
  const loggedIn = useSelector(state => state.authentication.loggedIn);
  const error = useSelector(state => state.authentication.error);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Ops!',
        message: "Login inválido",
        autoClose: '4000',
        color: "red"
      })
    }
  }, [error]);

  const handleSubmit = (values) => {
    dispatch(userActions.login(values.email, values.password));
  }

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
        <Text c="dimmed" size="md" ta="center" mt={5} mb={7}>
          Ainda não tem cadastro?{' '}
          <Link to={{ pathname: '/signup' }}>
            <Anchor size="md" component="button">
              Criar conta
            </Anchor>
          </Link>
        </Text>
        <Space h="lg" />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            label="Nome de usuário ou email" 
            placeholder="seu@email.com" 
            size="lg"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput 
            label="Senha" 
            placeholder="Digite sua senha" 
            size="lg" 
            mt="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox defaultChecked label="Lembrar meus dados" />
            <Anchor component="button" size="md">
              Esqueci a senha
            </Anchor>
          </Group>
          <Button 
            type="submit"
            loading={loggingIn}
            disabled={loggedIn}
            fullWidth
            size='lg'
            color='violet'
            mt='xl'
          >
            {loggedIn ? "Acessando..." : "Entrar"}
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