import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/authentication'
import { userInfos } from '../../store/actions/user'
import { useMantineColorScheme, Container, Flex, Center, Image, Button, Text, Anchor, Avatar, Badge, ActionIcon, Modal, Loader } from '@mantine/core'
import { IconUser, IconLock, IconEye, IconAdjustmentsHorizontal, IconCamera,  IconHeartHandshake, IconPackages, IconCalendarMonth,
  IconChevronRight, IconLogout, IconBrightnessUp, IconMoon, IconEdit, IconStar } from '@tabler/icons-react'
import FooterMenuMobile from '../../components/footerMenuMobile'
import {IKUpload} from 'imagekitio-react'

function MenuMobile () {

  document.title = 'Menu | Mublin'

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  let navigate = useNavigate()
  const { colorScheme, setColorScheme,  } = useMantineColorScheme()
  const [showModalPicture, setShowModalPicture] = useState(false)

  useEffect(() => { 
    dispatch(userInfos.getInfo())
  }, [])

  const setNewColorTheme = (option) => {
    setColorScheme(option)
  }

  const logout = () => {
    setColorScheme('light')
    dispatch(userActions.logout())
  }

  // Picture upload
  const userAvatarPath = '/users/avatars/'+user.id+'/'
  const [uploading, setUploading] = useState(false)
  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  };
  const onUploadSuccess = res => {
    notifications.show({
      title: 'Sucesso!',
      message: 'Foto de perfil carregada com sucesso',
      color: 'lime',
      position: 'top-right'
    })
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    updatePicture(user.id,fileName);
    setUploading(false);
  }
  const updatePicture = (userId, value) => {
    let user = JSON.parse(localStorage.getItem('user'));
    fetch('https://mublin.herokuapp.com/user/'+userId+'/picture', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token
        },
        body: JSON.stringify({picture: value})
      }).then((response) => {
        response.json().then((response) => {
          dispatch(userInfos.getInfo());
        })
      }).catch(err => {
        console.error(err)
      })
  }
  const onUploadError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
  }

  const iconMenuStyle = { width: 17, height: 17 }

  return (
    <>
      <Container
        size={'xs'}
        mb={100}
        mt={20}
      >
        <Center>
          <Avatar 
            radius='lg'
            size='82px'
            src={
              user.picture 
              ? 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture
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
            color='violet'
            onClick={() => setShowModalPicture(true)}
          >
            <IconCamera style={{width:'70%',height:'70%',marginLeft:'2px'}} stroke={1.5} />
          </ActionIcon>
        </Center>
        <Text ta='center' size='lg' mt={7}>
          Olá, <span style={{fontWeight:'500'}}>{user.name}</span>!
        </Text>
        <Center>
          {user.plan === 'Pro' ? (
            <Badge color='violet' size='sm'>conta pro</Badge>
          ) : (
            <Flex direction='column' align='center' mt={8}>
              <Badge color='gray' size='sm'>conta grátis</Badge>
              <Anchor 
                href={`https://buy.stripe.com/8wM03sfPadmmc4EaEE?client_reference_id=${user.id}&prefilled_email=${user.email}&utm_source=gear`} 
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
        <Center mt={22} mb={22}>
          {colorScheme === 'dark' && 
            <Button
              size='xs'
              fw='500'
              variant='outline'
              radius='xl'
              color='violet'
              leftSection={<IconBrightnessUp size='1.5rem' stroke={1.5} />}
              onClick={() => setNewColorTheme('light')}
            >
              Mudar para o tema claro
            </Button>
          }
          {colorScheme === 'light' && 
            <Button
              size='xs'
              fw='500'
              variant='outline'
              radius='xl'
              color='violet'
              leftSection={<IconMoon size='1.5rem' stroke={1.5} />}
              onClick={() => setNewColorTheme('dark')}
            >
              Mudar para o tema escuro
            </Button>
          }
        </Center>
        <Flex
          direction='column'
          gap='0.35rem'
        >
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconUser style={iconMenuStyle} />} rightSection={<IconChevronRight/>} component='a' href={'/'+user.username} fw='420'>
            Ir para meu perfil
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconEdit style={iconMenuStyle} />} rightSection={<IconChevronRight/>} component='a' href='/settings' fw='420'>
            Editar meus dados
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconAdjustmentsHorizontal style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Preferências musicais
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconCalendarMonth style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Disponibilidade para gigs
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconHeartHandshake style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Parceiros e Endorsements
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconPackages style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420' onClick={() => navigate('/settings/my-gear')}>
            Meus equipamentos
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconLock style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Senha
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconStar style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Assinatura Mublin PRO
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconEye style={iconMenuStyle} />} rightSection={<IconChevronRight />} fw='420'>
            Privacidade da conta
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='md' justify='space-between' leftSection={<IconLogout style={iconMenuStyle} />} rightSection={<IconChevronRight />} onClick={() => logout()} fw='420'>
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
          {uploading || user.requesting ? (
            <Loader size={61} />
          ) : (
            <>
              {!user.picture ? (
                <Image
                  radius={'md'}
                  src='https://ik.imagekit.io/mublin/tr:h-140,w-140,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'
                  w={140}
                />
              ) : (
                <Image
                  radius={'md'}
                  src={'https://ik.imagekit.io/mublin/tr:h-140,w-140,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture}
                  w={140}
                />
              )}
            </>
          )}
        </Center>
        <Center>
          <div className='customFileUpload'>
            <IKUpload 
              fileName='avatar.jpg'
              folder={userAvatarPath}
              tags={['tag1']}
              useUniqueFileName={true}
              isPrivateFile= {false}
              onError={onUploadError}
              onSuccess={onUploadSuccess}
              onUploadStart={onUploadStart}
            />
          </div>
        </Center>
      </Modal>
    </>
  )
}

export default MenuMobile