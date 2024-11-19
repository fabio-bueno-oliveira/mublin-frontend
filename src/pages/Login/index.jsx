import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation  } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import {
  Center,
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
  Button
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import Header from '../../components/header/public';
import { IconCheck, IconX } from '@tabler/icons-react';

function LoginPage () {

  document.title = 'Mublin';

  const search = useLocation().search;
  const urlInfo = new URLSearchParams(search).get("info");
  let dispatch = useDispatch();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: isNotEmpty('Informe o email ou usuário'),
      password: isNotEmpty('Informe a senha')
    },
  });

  const loggingIn = useSelector(state => state.authentication.loggingIn);
  const loggedIn = useSelector(state => state.authentication.loggedIn);
  const error = useSelector(state => state.authentication.error);

  const handleSubmit = (values) => {
    dispatch(userActions.login(values.email, values.password));
  }

  return (
      <>
      <Header page={'login'} />
      <Container size={420} my={40}>
        {urlInfo === "firstAccess" &&
          <Alert 
            variant="light" 
            color="green" 
            title="Cadastro efetuado com sucesso!" 
            icon={<IconCheck />}
            mb='md'
          />
        }
        {error &&
          <Alert 
            variant="light" 
            color="red" 
            icon={<IconX />}
            mb='md'
            title="Login inválido"
          />
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
            label="Email ou nome de usuário" 
            placeholder="seu@email.com ou usuário" 
            size="lg"
            autoFocus
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
            <Checkbox defaultChecked label="Lembrar meus dados" color="violet" />
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
        <Center mt={12}>
          <Link to={{ pathname: '/' }}>
            <Anchor size="md" component="button">
              Voltar à home
            </Anchor>
          </Link>
        </Center>
      </Container>
    </>
    );
};

export default LoginPage;