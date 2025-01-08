import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { Grid, Container, Group, Box, Flex, Button, PasswordInput, Text } from '@mantine/core'
import { matchesField, useForm } from '@mantine/form'
import { IconChevronLeft } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'

function SettingsPasswordPage () {

  document.title = 'Alterar senha | Mublin'

  const token = localStorage.getItem('token')

  let navigate = useNavigate()
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      newPassword: '',
      confirmPassword: ''
    },

    validate: {
      confirmPassword: matchesField(
        'newPassword',
        'As senhas não são iguais'
      ),
    },
  });

  const handleSubmitPasswordChange = (values) => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/userInfo/changePassword', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, newPassword: values.newPassword})
    }).then((response) => {
      response.json().then((response) => {
        setIsLoading(false)
        notifications.show({
          title: 'Tudo certo!',
          message: 'Sua senha foi atualizada com sucesso',
          color: 'lime',
          position: 'top-center'
        })
        // form.reset();
      })
    }).catch(err => {
      setIsLoading(false)
      console.error(err)
      notifications.show({
        title: 'Ops...',
        message: 'Ocorreu um erro ao tentar atualizar sua senha. Tente novamente em instantes',
        color: 'red',
        position: 'top-center'
      })
    })
  }

  return (
    <>
      <div className='mantine-visible-from-md'>
        <Header />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          <Grid.Col span={4} pt={20} visibleFrom='md'>
            <SettingsMenu page='password' />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={8} className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Text 
                mr='10'
                mb='xl'
                className='lhNormal'
                truncate='end'
                size='1.10rem'
                fw='600'
              >
                Alterar minha senha
              </Text>
            </Flex>
            <Box maw={340} mx='auto'>
              <Text 
                mr='10'
                mb='xl'
                className='lhNormal'
                truncate='end'
                size='1.10rem'
                fw='600'
                visibleFrom='md'
              >
                Alterar minha senha
              </Text>
              <form onSubmit={form.onSubmit(handleSubmitPasswordChange)}>
                <PasswordInput
                  label='Nova senha'
                  placeholder='Digite a nova senha'
                  key={form.key('newPassword')}
                  {...form.getInputProps('newPassword')}
                />

                <PasswordInput
                  mt='sm'
                  label='Confirme a senha'
                  placeholder='Digite novamente a nova senha'
                  key={form.key('confirmPassword')}
                  {...form.getInputProps('confirmPassword')}
                />

                <Group justify='flex-end' mt='md'>
                  <Button 
                    type='submit'
                    color='violet'
                    size='md' 
                    loading={isLoading}
                  >
                    Enviar
                  </Button>
                </Group>
              </form>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsPasswordPage