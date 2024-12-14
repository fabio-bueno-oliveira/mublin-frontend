import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import {
  useMantineColorScheme, Alert, Center, Flex, Image, TextInput, Anchor, Text, Container, Button, rem
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useForm, isNotEmpty } from '@mantine/form';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import s from '../../components/header/public/header.module.css';

function ForgotPasswordPage () {

  document.title = 'Esqueci a senha | Mublin';

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: ''
    },

    validate: {
      email: isNotEmpty('Informe o email')
    },
  });

  const { colorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  const loggedIn = useSelector(state => state.authentication.loggedIn);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [isLoading, setIsLoading] = useState(false);
  const [showMsgSuccess, setShowMsgSuccess] = useState(false);
  const [showMsgError, setShowMsgError] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    fetch('https://mublin.herokuapp.com/forgotPassword', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: values.email})
    })
    .then(res => res.json())
    .then((result) => {
      setIsLoading(false);
      if (result.message.includes('No user found with email')) {
        setShowMsgError(true);
        setShowMsgSuccess(false);
        notifications.show({
          position: 'top-right',
          color: 'red',
          title: 'Ops!',
          message: 'Ocorreu um erro. Parece que este email não está cadastrado em nossa base',
        });
      } else {
        setShowMsgSuccess(true);
        setShowMsgError(false);
        notifications.show({
          position: 'top-right',
          color: 'green',
          title: 'Confira seu email!',
          message: 'Enviamos em seu email as informações para a redefinição de sua senha',
        });
      }
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
      setShowMsgError(false);
      setShowMsgSuccess(false);
      alert('Ocorreu um erro inesperado. Tente novamente em instantes.');
    })
  }

  return (
      <>
      {loggedIn &&
        <Navigate to="/home" />
      }
      <Center mt={80} mb={28}>
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
        {showMsgSuccess && 
          <Alert variant='light' color='green' mb='sm' icon={checkIcon}>
             Enviamos um email com informações para redefinição da senha
          </Alert>
        }
        {showMsgError &&
        <>
          <Alert variant='light' color='red' mb='sm' icon={xIcon}>
            Parece que este email não está cadastrado
          </Alert>
        </>
        }
        <Text size='xl' fw='500' ta='center'>Esqueci a senha</Text>
        <Text size='sm' c='dimmed' ta='center' mb='xl'>
          Informe seu email de cadastro e enviaremos um link pra você redefinir sua senha
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            type='email'
            label='E-mail'
            placeholder='seu@email.com ou usuário'
            size='md'
            autoFocus
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <Button 
            type='submit'
            loading={isLoading}
            fullWidth
            size='md'
            color='violet'
            mt='xl'
            disabled={isLoading}
          >
            Enviar
          </Button>
        </form>
        <Text c="dimmed" size="sm" ta="center" mt={15} mb={7}>
          <Link to={{ pathname: '/login' }}>
            <Anchor size="md" component="button">
              Voltar ao login
            </Anchor>
          </Link>
        </Text>
      </Container>
    </>
    );
};

export default ForgotPasswordPage;