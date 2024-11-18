import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailCheckInfos } from '../../store/actions/emailCheck';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/header/public';
import Footer from '../../components/footer/public';
import { 
  Grid, Alert, Container, Button, Group, Badge, Loader,
  Title, Text, Space, PasswordInput, TextInput
} from '@mantine/core';
import { useForm, isEmail, isNotEmpty, hasLength } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';

function SignupPage () {

    // const loggedIn = useSelector(state => state.authentication.loggedIn);

    document.title = 'Mublin - Cadastrar';

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const emailAvailability = useSelector(state => state.emailCheck);
    const usernameAvailability = useSelector(state => state.usernameCheck);

    const form = useForm({
      mode: 'uncontrolled',
      validateInputOnChange: true,
      initialValues: {
        name: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },

      validate: {
        name: (value) => (value.length < 2 ? 'Informe seu nome. O nome deve conter no mínimo 2 letras' : null),
        lastname: isNotEmpty('Informe o seu sobrenome'),
        // email: (value) => {
        //   if (!value.trim().length) return 'Email cannot be empty';
        //   if (!RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(value)) return 'Invalid email';
        //   if (!emailAvailability.available && !emailAvailability.requesting) return 'Email já cadastrado';
        //   return null;
        // }
        email: isEmail('Email inválido'),
        username: hasLength({ min: 2, max: 14 }, 'Informe o username desejado com no mínimo 2 caracteres e no máximo 14'),
        password: (value) => (value.length < 4 ? 'Senha muito curta' : null),
        confirmPassword: (value, values) =>
          value !== values.password ? 'As senhas informadas estão diferentes' : null
      },
    });

    const checkEmail = useDebouncedCallback(async (string) => {
      if (string.length && !form?.errors?.email) {
        dispatch(emailCheckInfos.checkEmailByString(string));
      }
    }, 900);

    const [usernameChoosen, setUsernameChoosen] = useState('')
    const checkUsername = useDebouncedCallback(async (string) => {
      if (string.length) {
        dispatch(usernameCheckInfos.checkUsernameByString(string));
      }
    }, 900);

    const handleSubmit = (values) => {
      if (emailAvailability.available === false || usernameAvailability.available === false) {
        return false;
      }
      fetch('https://mublin.herokuapp.com/user/create/', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: values.name, lastname: values.lastname, email: values.email, username: values.username, password: values.password})
      })
      .then(res => res.json())
      // .then(res => localStorage.setItem('user', JSON.stringify(res)))
      .then(
        navigate("/login?info=firstAccess")
      )
    }

    return (
      <>
        <Header />
        <Container size={'xs'} my={40}>
          <Title ta="center" order={1}>
            Crie sua conta grátis
          </Title>
          <Text c="dimmed" size="md" ta="center" mt={5} mb={7}>
            Preencha os dados abaixo
          </Text>
          <Space h="md" />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid mb='sm'>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  size="lg"
                  label="Nome"
                  key={form.key('name')}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <TextInput
                  size="lg"
                  label="Sobrenome"
                  key={form.key('lastname')}
                  {...form.getInputProps('lastname')}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              size="lg"
              label="Email"
              placeholder="seu@email.com"
              disabled={emailAvailability.requesting}
              rightSection={emailAvailability.requesting && <Loader size={20} />}
              key={form.key('email')}
              {...form.getInputProps('email')}
              onKeyUp={e => {
                checkEmail(e.target.value)
              }}
            />
            {(emailAvailability.available === false) && 
              <Badge 
                leftSection={<IconX style={{ width: '12px', height: '12px' }} />} 
                color="red"
                size='sm'
                mt='xs'
              >Email já cadastrado!</Badge>
            }
            <TextInput
              size="lg"
              mt="md"
              label="Username"
              description={`mublin.com/${usernameChoosen}`}
              disabled={usernameAvailability.requesting}
              rightSection={usernameAvailability.requesting && <Loader size={20} />}
              key={form.key('username')}
              {...form.getInputProps('username')}
              onKeyUp={e => {
                checkUsername(e.target.value.replace(/[^A-Z0-9]/ig, "").toLowerCase())
                setUsernameChoosen(e.target.value.replace(/[^A-Z0-9]/ig, "").toLowerCase())
                form.setFieldValue('username', e.target.value.replace(/[^A-Z0-9]/ig, "").toLowerCase());
              }}
            />
            {(usernameChoosen?.length > 2 && usernameAvailability.available) && 
              <Badge 
                leftSection={<IconCheck style={{ width: '12px', height: '12px' }} />} 
                color="green"
                size='sm'
                mt='xs'
              >Usuário disponível!</Badge>
            }
            {(usernameChoosen && usernameAvailability.available === false) && 
              <Badge 
                leftSection={<IconX style={{ width: '12px', height: '12px' }} />} 
                color="red"
                size='sm'
                mt='xs'
              >Usuário indisponível!</Badge>
            }
            <Grid mt='sm' mb='md'>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <PasswordInput
                  size="lg"
                  label="Senha"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <PasswordInput
                  size="lg"
                  label="Confirme a senha"
                  key={form.key('confirmPassword')}
                  {...form.getInputProps('confirmPassword')}
                />
              </Grid.Col>
            </Grid>
            {(usernameChoosen && usernameAvailability.available === false) && 
              <Alert 
                variant="light" 
                color="red" 
                title="Username já existente!" 
                icon={<IconInfoCircle />}
              >
                O username que você informou já está em uso. Por gentileza escolha outro nome de usuário.
              </Alert>
            }
            {(emailAvailability.available === false) && 
              <Alert 
                variant="light" 
                color="red" 
                title="Email já cadastrado!" 
                icon={<IconInfoCircle />}
              >
                O email que você informou já está cadastrado.
              </Alert>
            }
            <Group justify="flex-end" mt="lg">
              <Button 
                size="lg"
                color='violet'
                type="submit"
                // disabled={(usernameChoosen && usernameAvailability.available && emailAvailability.available) ? false : true}
              >
                Continuar
              </Button>
            </Group>
          </form>
        </Container>
        <Footer />
      </>
    );
};

export default SignupPage;