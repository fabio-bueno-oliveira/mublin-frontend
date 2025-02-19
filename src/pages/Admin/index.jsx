import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Tabs, PasswordInput, Title, Text, TextInput, Button, Alert, rem } from '@mantine/core';
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { userActions } from '../../store/actions/user'
import { IconPhoto, IconLock, IconUsersGroup, IconPackages } from '@tabler/icons-react'

function AdminPage () {
 
  document.title = 'Admin | Mublin'

  const userSession = JSON.parse(localStorage.getItem('user'));

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(userInfos.getInfo());
  }, [userSession.id, dispatch]);

  const userInfo = useSelector(state => state.user)

  const [isLoading, setIsLoading] = useState(false)

  const iconStyle = { width: rem(12), height: rem(12) }

  const [userId, setUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false)

  const handleSubmitPasswordChange = () => {
    setIsLoading(true)
    let user = JSON.parse(localStorage.getItem('user'));
    fetch('https://mublin.herokuapp.com/profile/changePassword', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({userId: userId, newPassword: newPassword})
    }).then((response) => {
      response.json().then((response) => {
        setIsLoading(false)
        setPasswordChangedSuccess(true)
        setNewPassword('')
      })
    }).catch(err => {
      setIsLoading(false)
      console.error(err)
      alert('Ocorreu um erro ao tentar alterar a senha do usuário. Tente novamente em instantes')
      setNewPassword('')
    })
  }

  return (
    <>
      {userInfo.level === 1 ? ( 
        <>
          <Header />
          <Container size='lg'>
            <Title order={1}>Admin</Title>
            {passwordChangedSuccess &&
              <Alert variant='light' color='lime' title='Boa!'>
                Senha atualizada com sucesso
              </Alert>
            }
            <Tabs color="violet" defaultValue="password">
              <Tabs.List mb={20}>
                <Tabs.Tab value="password" leftSection={<IconLock style={iconStyle} />}>
                  Alterar senha de usuário
                </Tabs.Tab>
                <Tabs.Tab value="picture" leftSection={<IconPhoto style={iconStyle} />}>
                  Alterar foto de usuário
                </Tabs.Tab>
                <Tabs.Tab value="users" leftSection={<IconUsersGroup style={iconStyle} />}>
                  Lista de usuários
                </Tabs.Tab>
                <Tabs.Tab value="gear" leftSection={<IconPackages style={iconStyle} />}>
                  Lista de equipamentos
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="password">
                <Text fz={20} fw={400} mb={10} c='dimmed'>Alterar senha de usuário</Text>
                <TextInput
                  type='number'
                  label='ID do usuário'
                  value={userId}
                  w={350}
                  onChange={e => setUserId(e.currentTarget.value)}
                />
                <PasswordInput
                  label='Nova senha'
                  value={newPassword}
                  w={350}
                  onChange={(event) => setNewPassword(event.currentTarget.value)}
                />
                <Button 
                  loading={isLoading} 
                  color='violet'
                  mt={10}
                  onClick={handleSubmitPasswordChange} 
                  disabled={!newPassword ? true : false}
                >
                  Alterar
                </Button>
              </Tabs.Panel>
              <Tabs.Panel value="picture">
                Alterar foto de usuário
              </Tabs.Panel>
              <Tabs.Panel value="users">
                Lista de usuários
              </Tabs.Panel>
              <Tabs.Panel value="gear">
                Lista de equipamentos
              </Tabs.Panel>
            </Tabs>
          </Container>
        </>
      ) :( 
        <Container size='lg'>
          <Text ta='center'>Acesso negado</Text>
        </Container>
      )}
      <FooterMenuMobile />
    </>
  )
}

export default AdminPage