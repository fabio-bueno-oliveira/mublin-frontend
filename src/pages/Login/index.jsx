import React from 'react'
import { Container } from '@mantine/core';
import { Grid } from '@mantine/core';
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocation } from 'react-router-dom';

function Login () {

  document.title = "Mublin"

  const location = useLocation()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <>
      <main>
        <h1>TESTE</h1>
        <Container fluid h={50}>
          Fluid container has 100% max-width
        </Container>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <Checkbox
            mt="md"
            label="I agree to sell my privacy"
            key={form.key('termsOfService')}
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </main>
    </>
  )
}

export default Login