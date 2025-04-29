import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Grid, Container, Center, Loader, Box, Flex, Button, Avatar, Image, Text, Divider, Card } from '@mantine/core'
import { IconChevronLeft, IconCamera } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'
import { IKUpload } from 'imagekitio-react'
import { Helmet } from 'react-helmet'

function SettingsPicturePage () {

  document.title = 'Foto de perfil | Mublin'

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')

  let navigate = useNavigate()
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const [picture, setPicture] = useState(userInfo.picture)
  const user = useSelector(state => state.user)

  // Picture upload
  const userAvatarPath = '/users/avatars/'
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
  const onUploadError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
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

  // Cover image upload
  const userCoverPath = '/users/avatars/'
  const [uploadingCover, setUploadingCover] = useState(false)

  const onUploadCoverStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  }
  const onUploadCoverSuccess = res => {
    let n = res.filePath.lastIndexOf('/')
    let fileName = res.filePath.substring(n + 1)
    updateCoverPicture(loggedUserId, fileName)
  }
  const onUploadCoverError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
  }
  const updateCoverPicture = (userId, filename) => {
    fetch('https://mublin.herokuapp.com/user/'+userId+'/coverPicture', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({coverPicture: filename})
      }).then((response) => {
        response.json().then((response) => {
          setUploadingCover(false)
          notifications.show({
            title: 'Boa!',
            message: 'A foto de capa foi atualizada com sucesso',
            color: 'lime',
            position: 'top-center'
          })
        })
      }).catch(err => {
        console.error(err)
        setUploadingCover(false)
        alert('Ocorreu um erro ao atualizar a foto de capa. Tente novamente em instantes')
      })
  }

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Alterar foto de perfil | Mublin</title>
        <link rel='canonical' href='https://mublin.com/settings/picture' />
      </Helmet>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={isLargeScreen ? 0 : 15}>
          {isLargeScreen && 
            <Grid.Col span={4} pt={20}>
              <SettingsMenu page='profilePicture' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={8} className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Text 
                mr='10' 
                className='lhNormal'
                truncate='end'
                size='1.10rem'
                fw='600'
              >
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
                      <Avatar
                        src='https://ik.imagekit.io/mublin/tr:h-280,w-280,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'
                        size={140}
                      />
                    ) : (
                      <Avatar
                        src={'https://ik.imagekit.io/mublin/tr:h-280,w-280,c-maintain_ratio/users/avatars/'+picture}
                        size={140}
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
                    {uploading ? 'Enviando...' : 'Escolher nova foto de perfil'}
                  </Button>
                </div>
              </Center>
              <Divider mt={14} mb={20} />
              <Center>
                {uploading ? ( 
                  <Loader color='violet' />
                ) : (
                  <>
                    {user.picture_cover ? (
                      <Image
                        src={`https://ik.imagekit.io/mublin/tr:w-380,c-maintain_ratio/users/avatars/${user.picture_cover}`}
                        width={380}
                        alt={`Imagem de capa de ${user.name}`}
                      />
                    ) : (
                      <Center mb={20}>
                        <Card px={0} pt={30} withBorder radius={0} w={380} h={80}>
                          <Text size='sm' c='gray' ta='center'>
                            Nenhuma imagem de capa no momento
                          </Text>
                        </Card>
                      </Center>
                    )}
                  </>
                )}
              </Center>
              <Center>
                <div className='customFileUpload'>
                  <IKUpload
                    fileName='cover.jpg'
                    folder={userCoverPath}
                    tags={['cover','user']}
                    name='file-cover-input'
                    id='userCover'
                    className='file-input__input'
                    useUniqueFileName={true}
                    isPrivateFile= {false}
                    onError={onUploadCoverError}
                    onSuccess={onUploadCoverSuccess}
                    onUploadStart={onUploadCoverStart}
                  />
                  <Button
                    component='label'
                    htmlFor='userCover'
                    leftSection={<IconCamera size={14} />}
                    color='violet'
                    size='sm'
                    disabled={uploadingCover}
                  >
                    {uploadingCover ? 'Enviando...' : 'Escolher nova foto de capa'}
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