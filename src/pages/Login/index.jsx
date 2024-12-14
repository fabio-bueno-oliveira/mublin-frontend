import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useLocation  } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import {
  useMantineColorScheme,
  Center,
  Flex,
  Alert,
  Image,
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Space,
  Text,
  Container,
  Group,
  Button
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useForm, isNotEmpty } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import s from '../../components/header/public/header.module.css';

function LoginPage () {

  document.title = 'Login | Mublin';

  const search = useLocation().search;
  const urlInfo = new URLSearchParams(search).get("info");

  const loggedIn = useSelector(state => state.authentication.loggedIn);

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

  const { colorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  const loggingIn = useSelector(state => state.authentication.loggingIn);
  const error = useSelector(state => state.authentication.error);

  const handleSubmit = (values) => {
    dispatch(userActions.login(values.email, values.password));
  }

  return (
      <>
      {loggedIn &&
        <Navigate to="/home" />
      }
      <Center mt={80} mb={34}>
        <Link to={{ pathname: '/' }} className={s.mublinLogo}>
          <Flex gap={3} align='center'>
            <Image 
              src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
              h={largeScreen ? 42 : 40} 
            />
          </Flex>
        </Link>
      </Center>
      <Container size={420} mb={40}>
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
        <Space h="lg" />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            label="Email ou nome de usuário" 
            placeholder="seu@email.com ou usuário" 
            size="md"
            autoFocus
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput 
            label="Senha" 
            placeholder="Digite sua senha" 
            size="md" 
            mt="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox defaultChecked label="Lembrar meus dados" color="violet" />
            <Anchor size="sm" href='/login/forgot'>
              Esqueci a senha
            </Anchor>
          </Group>
          <Button 
            type="submit"
            loading={loggingIn}
            fullWidth
            size='md'
            color='violet'
            mt='xl'
          >
            Login
          </Button>
        </form>
        <Text c="dimmed" size="sm" ta="center" mt={15} mb={7}>
          Ainda não possui cadastro?{' '}
          <Link to={{ pathname: '/signup' }}>
            <Anchor size="md" component="button">
              Crie sua conta grátis
            </Anchor>
          </Link>
        </Text>
      </Container>
    </>
    );
};

export default LoginPage;