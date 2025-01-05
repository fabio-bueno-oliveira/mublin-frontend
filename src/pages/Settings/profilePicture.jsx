import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Grid, Container, Center, Loader, Box, Flex, Button, Image, Text, Anchor } from '@mantine/core'
import { IconChevronLeft, IconCamera } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'
import { IKUpload } from 'imagekitio-react'

function SettingsPicturePage () {

  document.title = 'Foto de perfil | Mublin'

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const [picture, setPicture] = useState(userInfo.picture)

  // Picture upload
  const userAvatarPath = '/users/avatars/'+loggedUserId+'/'
  const [uploading, setUploading] = useState(false)

  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  }

  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/')
    let fileName = res.filePath.substring(n + 1)
    updatePicture(loggedUserId,fileName)
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
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          setPicture(value)
          setUploading(false)
          notifications.show({
            title: 'Boa!',
            message: 'Foto de perfil atualizada com sucesso',
            color: 'lime',
            position: 'top-center'
          })
        })
      }).catch(err => {
        console.error(err)
        setUploading(false)
      })
  }

  const onUploadError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
  }

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          {isLargeScreen && 
            <Grid.Col span={4} pt={20}>
              <SettingsMenu page='profilePicture' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={8} className='showOnlyInMobile'>
              <Anchor href='/menu'>
                <IconChevronLeft 
                  style={{width:'22px',height:'22px'}} 
                />
              </Anchor>
              <Text size='1.164rem' fw='500' className='lhNormal'>
                Foto de perfil
              </Text>
            </Flex>
            <Box pos='relative' p={10}>
              <Center>
                {uploading ? ( 
                  <Loader color='violet' />
                ) : (
                  <>
                    {!userInfo.picture ? (
                      <Image
                        radius={'md'}
                        src='https://ik.imagekit.io/mublin/tr:h-140,w-140,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'
                        w={140}
                      />
                    ) : (
                      <Image
                        radius={'md'}
                        src={'https://ik.imagekit.io/mublin/tr:h-140,w-140,c-maintain_ratio/users/avatars/'+loggedUserId+'/'+picture}
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
                    tags={['avatar','user']}
                    name='file-input'
                    id='userPicture'
                    className='file-input__input'
                    useUniqueFileName={true}
                    isPrivateFile= {false}
                    onError={onUploadError}
                    onSuccess={onUploadSuccess}
                    onUploadStart={onUploadStart}
                  />
                  <Button
                    component='label'
                    htmlFor='userPicture'
                    leftSection={<IconCamera size={14} />}
                    color='violet'
                    size='sm'
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Inserir imagem'}
                  </Button>
                </div>
              </Center>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsPicturePage