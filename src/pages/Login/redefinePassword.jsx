import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation  } from 'react-router';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
  useMantineColorScheme, Alert, Center, Flex, Image, Text, PasswordInput, Container, Button, rem
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { matchesField, isNotEmpty, useForm } from '@mantine/form';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import s from '../../components/header/public/header.module.css';

function RedefinePasswordPage () {

  document.title = 'Redefinir senha | Mublin';

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      repassword: '',
    },

    validate: {
      password: isNotEmpty('Informe a nova senha'),
      repassword: matchesField(
        'password',
        'As senhas não são idênticas'
      ),
    },
  });

  const { colorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  const navigate = useNavigate();

  const search = useLocation().search;
  const hash = new URLSearchParams(search).get("hash");
  const email = new URLSearchParams(search).get("email");

  const loggedIn = useSelector(state => state.authentication.loggedIn);

  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitNewPassword = (values) => {
    setIsLoading(true);
    fetch('https://mublin.herokuapp.com/userInfo/changePasswordbyHash', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, hash: hash, newPassword: values.password})
    })
    .then((response) => {
      setIsLoading(false);
      setSuccess(true);
      notifications.show({
        position: 'top-right',
        color: 'green',
        title: 'Sucesso!',
        message: 'Email de refinição de senha enviado com sucesso',
      });
    }).catch(err => {
      setIsLoading(false);
      console.error(err);
      notifications.show({
        position: 'top-right',
        color: 'red',
        title: 'Ops!',
        message: 'Ocorreu um erro ao redefinir sua senha. Tente novamente em instantes',
      });
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
        <Text size='xl' fw='500' ta='center'>Redefinir minha senha</Text>
        <Text size='sm' c='dimmed' ta='center' mb='xl'>
          Insira a nova senha desejada
        </Text>
        {!success ? ( 
          <>
            {(hash && email) ? ( 
              <form onSubmit={form.onSubmit(submitNewPassword)}>
                <PasswordInput 
                  label="Nova senha" 
                  size="md" 
                  mt="md"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
                <PasswordInput 
                  label="Confirme a nova senha"  
                  size="md" 
                  mt="md"
                  key={form.key('repassword')}
                  {...form.getInputProps('repassword')}
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
            ) : (
              <Alert variant='light' color='red' mb='sm'>
                Houve algum erro, ou talvez a solicitação tenha expirado.
              </Alert>
            )}
          </>
        ) : (
          <>
            <Center> 
              <Alert variant='light' color='green' mb='sm' title='Yeah!' icon={checkIcon}>
                Senha atualizada com sucesso
              </Alert>
            </Center>
            <Center>
              <Button color='violet' onClick={() => navigate('/login')}>Ir para login</Button>
            </Center>
          </>
        )}
      </Container>
    </>
    );
};

export default RedefinePasswordPage;