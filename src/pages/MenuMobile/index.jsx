import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../store/actions/authentication'
import { LoadingOverlay, useMantineColorScheme, Container, Flex, Center, Image, Button, Text, Anchor, Avatar, Badge, ActionIcon, Modal } from '@mantine/core'
import { IconUser, IconLock, IconEye, IconAdjustmentsHorizontal, IconCamera,  IconHeartHandshake, IconPackages, IconCalendarMonth,
  IconChevronRight, IconLogout, IconBrightnessUp, IconMoon, IconEdit, IconStar, IconUpload } from '@tabler/icons-react'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { notifications } from '@mantine/notifications'
import {IKUpload} from 'imagekitio-react'

function MenuMobile () {

  document.title = 'Menu | Mublin'

  const dispatch = useDispatch()
  let navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')

  const user = useSelector(state => state.user)

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const { colorScheme, setColorScheme,  } = useMantineColorScheme()

  const [picture, setPicture] = useState(userInfo.picture)
  const [showModalPicture, setShowModalPicture] = useState(false)

  const setNewColorTheme = (option) => {
    setColorScheme(option)
  }

  const logout = () => {
    setColorScheme('light')
    dispatch(authActions.logout())
  }

  // Picture upload
  const userAvatarPath = '/users/avatars/'+loggedUserId+'/'
  const [uploading, setUploading] = useState(false)
  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  };
  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    updatePicture(loggedUserId,fileName);
  }
  const updatePicture = (userId, value) => {
    fetch('https://mublin.herokuapp.com/user/'+userId+'/picture', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({picture: value})
      }).then((response) => {
        response.json().then((response) => {
          userInfo.picture = value;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          setPicture(value)
          setUploading(false)
          notifications.show({
            title: 'Sucesso!',
            message: 'Foto de perfil carregada com sucesso',
            color: 'lime',
            position: 'top-center'
          })
          setShowModalPicture(false)
        })
      }).catch(err => {
        console.error(err)
        setUploading(false)
      })
  }
  const onUploadError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
  }

  const iconMenuStyle = { width: 17, height: 17 }

  const buttonColor = colorScheme === 'light' ? 'dark' : 'light'

  return (
    <>
      <Container
        size={'xs'}
        mb={100}
        mt={20}
        className='menuMobile'
      >
        <Center>
          <Avatar 
            radius='lg'
            size='82px'
            src={
              userInfo.picture 
              ? 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+loggedUserId+'/'+picture
              : undefined
            }
            alt='Foto de perfil'
          />
        </Center>
        <Center 
          style={{
            position:'relative',
            marginTop:'-24px',
            marginLeft:'80px'
          }}
        >
          <ActionIcon
            variant='filled'
            radius='xl'
            size='lg'
            color='gray'
            onClick={() => setShowModalPicture(true)}
          >
            <IconCamera style={{width:'70%',height:'70%',marginLeft:'2px'}} stroke={1.5} />
          </ActionIcon>
        </Center>
        <Text ta='center' size='lg' mt={9}>
          Olá, <span style={{fontWeight:'500'}}>{userInfo.name}</span>!
        </Text>
        <Center>
          {user.plan === 'Pro' ? (
            <Badge 
              color='violet' 
              size='sm' 
              variant='gradient'
              gradient={{ from: 'violet', to: 'blue' }}
            >
              conta pro
            </Badge>
          ) : (
            <Flex direction='column' align='center' mt={8}>
              <Badge color='gray' size='sm'>conta grátis</Badge>
              <Anchor 
                href={`https://buy.stripe.com/eVaeYmgTefuu8SsfYZ?client_reference_id=${decoded.result.id}&prefilled_email=${decoded.result.email}&utm_source=menuMobile`}
                target='_blank'
                underline='hover'
              >
                <Text size='sm' c='violet'>
                  Quero me tornar Mublin PRO
                </Text>
              </Anchor>
            </Flex>
          )}
        </Center>
        <Center mt={22} mb={16}>
          {colorScheme === 'dark' && 
            <Button
              size='sm'
              fw='500'
              variant='outline'
              radius='xl'
              color='white'
              leftSection={<IconBrightnessUp size='1.5rem' stroke={1.5} />}
              onClick={() => setNewColorTheme('light')}
            >
              Mudar para o tema claro
            </Button>
          }
          {colorScheme === 'light' && 
            <Button
              size='sm'
              fw='500'
              variant='outline'
              radius='xl'
              color='dark'
              leftSection={<IconMoon size='1.5rem' stroke={1.5} />}
              onClick={() => setNewColorTheme('dark')}
            >
              Mudar para o tema escuro
            </Button>
          }
        </Center>
        <Flex
          direction='column'
          gap='0.2rem'
        >
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconUser style={iconMenuStyle} />} rightSection={<IconChevronRight/>} component='a' href={'/'+userInfo.username} fw='550'>
            Ir para meu perfil
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconEdit style={iconMenuStyle} />} rightSection={<IconChevronRight/>} component='a' href='/settings' fw='550'>
            Editar meus dados
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconStar style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550' onClick={() => navigate('/settings/plan')}>
            Assinatura Mublin PRO
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconAdjustmentsHorizontal style={iconMenuStyle} />} rightSection={<IconChevronRight />} component='a' href='/settings/preferences' fw='550'>
            Preferências musicais
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconCalendarMonth style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550' component='a' href='/settings/availability'>
            Disponibilidade para gigs
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconHeartHandshake style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550' component='a' href='/settings/endorsements'>
            Parceiros e Endorsements
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconPackages style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550' onClick={() => navigate('/settings/my-gear')}>
            Meus equipamentos
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconLock style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550' onClick={() => navigate('/settings/password')}>
            Senha
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconEye style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='550'>
            Privacidade da conta
          </Button>
          <Button variant='transparent' color={buttonColor} size='md' justify='space-between' leftSection={<IconLogout style={iconMenuStyle} />} rightSection={<IconChevronRight />} onClick={() => logout()} fw='550'>
            Sair
          </Button>
        </Flex>
      </Container>
      <FooterMenuMobile />
      <Modal 
        centered 
        opened={showModalPicture} 
        onClose={setShowModalPicture} 
        title='Alterar foto'
        size='xs'
      >
        <Center>
          <LoadingOverlay 
            visible={uploading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} 
          />
          {!userInfo.picture ? (
            <Image
              radius={'md'}
              src='https://ik.imagekit.io/mublin/tr:h-140,w-140,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'
              w={140}
            />
          ) : (
            <Image
              radius={'md'}
              src={'https://ik.imagekit.io/mublin/tr:h-140,w-140,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+picture}
              w={140}
            />
          )}
        </Center>
        <Center>
          <div className='customFileUpload'>
            <IKUpload 
              fileName='avatar.jpg'
              folder={userAvatarPath}
              tags={['avatar','user']}
              name='file-input'
              id='file-input'
              className='file-input__input'
              useUniqueFileName={true}
              isPrivateFile= {false}
              onError={onUploadError}
              onSuccess={onUploadSuccess}
              onUploadStart={onUploadStart}
            />
            <label className="file-input__label" htmlFor="file-input">
              <IconUpload />
              <span>Selecionar arquivo</span>
            </label>
          </div>
        </Center>
      </Modal>
    </>
  )
}

export default MenuMobile