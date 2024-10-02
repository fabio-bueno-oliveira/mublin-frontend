import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { emailCheckInfos } from '../../store/actions/emailCheck';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/public/header';
import { Footer } from '../../components/public/footer';
import { 
  Container, Button, Group, Badge,
  Title, Space, PasswordInput, TextInput
} from '@mantine/core';
import { useForm, isEmail, isNotEmpty, hasLength } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconAt, IconCheck, IconX } from '@tabler/icons-react';

function SignupPage () {

    // const loggedIn = useSelector(state => state.authentication.loggedIn);

    document.title = 'Mublin - Cadastrar';

    let dispatch = useDispatch();

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
        confirmPassword: '',
        // termsOfService: false,
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
        username: hasLength({ min: 2, max: 10 }, 'É necessário informar o username desejado com no mínimo 2 caracteres e no máximo 10'),
        password: (value) => (value.length < 4 ? 'Senha muito curta' : null),
        confirmPassword: (value, values) =>
          value !== values.password ? 'As senhas informadas estão diferentes' : null
      },
    });

    const checkEmail = useDebouncedCallback(async (string) => {
      if (!form?.errors?.email) {
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
      console.log(66, values);
      if (emailAvailability.available === false) {
        return <Notification icon={<IconX />} color="red" title="Bummer!">
          Something went wrong
        </Notification>
      }
      if (usernameAvailability.available === false) {
        return <Notification icon={<IconX />} color="red" title="Bummer!">
          Something went wrong
        </Notification>
      }
      // fetch('https://mublin.herokuapp.com/user/create/', {
      //     method: 'post',
      //     headers: {
      //       'Accept': 'application/json, text/plain, */*',
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({name: values.name, lastname: values.lastname, email: values.email, username: values.username, password: values.password})
      // })
      // .then(res => res.json())
      // // .then(res => localStorage.setItem('user', JSON.stringify(res)))
      // .then(
      //     history.push("/?info=firstAccess")
      // )
    }

    return (
      <>
        <Header />
        <Container size={'xs'} pt='xl'>
          <Title order={1}>Crie sua conta grátis</Title>
          <Title order={3}>Preencha os dados abaixo</Title>
          <Space h="md" />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              size="md"
              withAsterisk
              label="Nome"
              placeholder="Informe seu nome"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <TextInput
              size="md"
              withAsterisk
              label="Sobrenome"
              placeholder="Informe seu sobrenome"
              key={form.key('lastname')}
              {...form.getInputProps('lastname')}
            />
            <TextInput
              size="md"
              withAsterisk
              label="Email"
              placeholder="seu@email.com"
              key={form.key('email')}
              {...form.getInputProps('email')}
              onKeyUp={e => {
                checkEmail(e.target.value)
              }}
            />
            <TextInput
              size="md"
              withAsterisk
              label="Username"
              description={
                usernameAvailability.requesting ? 
                `mublin.com/${usernameChoosen} (verificando disponibilidade...)`
                : `mublin.com/${usernameChoosen}`
              }
              disabled={usernameAvailability.requesting}
              key={form.key('username')}
              {...form.getInputProps('username')}
              onKeyUp={e => {
                checkUsername(e.target.value)
                setUsernameChoosen(e.target.value)
              }}
              // error={(usernameChoosen && usernameAvailability.available === false)}
            />
            {(usernameChoosen && usernameAvailability.available) && 
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
            {/* <TextInput
              size="md"
              type='password'
              withAsterisk
              label="Senha"
              key={form.key('password')}
              {...form.getInputProps('password')}
            /> */}
            <PasswordInput
              size="md"
              label="Senha"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              size="md"
              label="Confirme a senha"
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            {/* <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              key={form.key('termsOfService')}
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            /> */}
            <Group justify="flex-end" mt="md">
              <Button 
                size='md'
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