import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { userActions } from '../../store/actions/user'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { Container, Flex, Box, Text, Paper, Avatar, Image, Textarea, NativeSelect, Button, Divider, Group, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import {IKUpload} from "imagekitio-react"
import { IconTrash, IconSend, IconPhoto, IconVideo, IconInfoSquareRounded } from '@tabler/icons-react'
import { format } from 'date-fns'

function NewPost () {

  const dispatch = useDispatch()
  let navigate = useNavigate()

  document.title = 'Novo post | Mublin'

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [postImage, setPostImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fileId, setFileId] = useState('')

  useEffect(() => {
    dispatch(userActions.getUserGearInfoById(loggedUserId))
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUserId))
  }, []);

  const [formValues, setFormValues] = useState({
    id_item_fk: '',
    related_item_type: '',
    id_feed_type_fk: '',
    text: '',
    image: '',
    video_url: ''
  })

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      id_item_fk: '',
      id_feed_type_fk: '',
      text: ''
    },

    onValuesChange: (values) => {
      setFormValues({
        ...formValues,
        text: values.text,
        id_item_fk: values.id_item_fk
      })
    },
  });

  // Image upload to imagekit.io
  const postsImagePath = '/posts/'
  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  }
  const onUploadError = err => {
    alert("Ocorreu um erro ao enviar a imagem do projeto. Tente novamente em alguns minutos.");
  }
  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/')
    let fileName = res.filePath.substring(n + 1)
    setFileId(res.fileId)
    setPostImage(fileName)
    setUploading(false)
  }

  const handleSubmitNewPost = (values) => {
    setIsSubmitting(true);
    fetch('https://mublin.herokuapp.com/feed/newPost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_user_1_fk: loggedUserId, id_item_fk: values.id_item_fk ? values.id_item_fk : '', related_item_type: formValues.related_item_type, id_feed_type_fk: 8, text: values.text, image: postImage ? postImage : '', video_url: formValues.video_url ? formValues.video_url : '' })
    })
    .then(response => {
      return response.json()
    }).then(jsonResponse => {
      setIsSubmitting(true)
      navigate('/home')
    }).catch (error => {
      setIsSubmitting(false)
      console.error(error)
      alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.");
    })
  }

  const handleRemoveImageFromServer = async (fileId) => {
    const url = `https://api.imagekit.io/v1/files/${fileId}`;
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
      }
    };

    try {
      await fetch(url, options);
    } catch (error) {
      console.error(error);
    }
  }

  const removeImage = () => {
    handleRemoveImageFromServer(fileId)
    setPostImage('')
    document.querySelector('#postImage').value = null
  }

  return (
    <>
      {isLargeScreen && 
        <Header />
      }
      <Container size="xs" mt='md' mb={40}>
        <Paper
          radius='md'
          withBorder={isLargeScreen ? true : false}
          px={isMobile ? 0 : 16}
          py={isMobile ? 0 : 6}
          className='mublinModule newPost'
        >
          <Flex gap={8} mt={8} align='center'>
            <Link to={{ pathname: `/${userInfo.username}` }}>
              <Avatar 
                w='45px'
                h='45px'
                src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-90,w-90,r-max,c-maintain_ratio/users/avatars/'+userInfo.picture : null} 
              />
            </Link>
            <Box>
              <Text size='md' fw={500}>
                {userInfo.name} {userInfo.lastname}
              </Text>
              <Text size='xs' c='dimmed'>
                Publicar no Mublin
              </Text>
            </Box>
          </Flex>
          <form onSubmit={form.onSubmit(handleSubmitNewPost)}>
            <Textarea
              size='md'
              placeholder='Sobre o que você quer falar hoje?'
              maxLength='10000'
              autosize
              minRows={3}
              maxRows={6}
              mt='14'
              key={form.key('text')}
              {...form.getInputProps('text')}
            />
            <Flex direction='column'>
              <div
                className='customFileUpload'
                style={postImage ? {display: 'none'} : undefined}
              >
                <IKUpload 
                  id='postImage'
                  fileName={`post_user-${userInfo.id}_${format(new Date(), 'yyyy-MM-dd-HH:mm:ssXX')}.jpg`}
                  folder={postsImagePath}
                  tags={['post']}
                  name='file-input'
                  className='file-input__input'
                  useUniqueFileName={true}
                  isPrivateFile= {false}
                  onUploadStart={onUploadStart}
                  onError={onUploadError}
                  onSuccess={onUploadSuccess}
                  accept="image/x-png,image/gif,image/jpeg" 
                />
                <Button
                  component='label'
                  htmlFor='postImage'
                  variant='outline'
                  leftSection={<IconPhoto size={18} />}
                  color='violet'
                  size='sm'
                >
                  {uploading ? 'Enviando...' : 'Imagem'}
                </Button>
                <Button
                  variant='outline'
                  leftSection={<IconVideo size={18} />}
                  color='violet'
                  size='sm'
                  disabled
                  ml={10}
                >
                  Vídeo
                </Button>
              </div>
            </Flex>
            {postImage && 
              <Flex align='center' justify='space-between' mt='18' mb='14'>
                <Button 
                  size='sm' 
                  color='red' 
                  onClick={() => removeImage()}
                  leftSection={<IconTrash size={14} />}
                >
                  Remover
                </Button>
                <Image
                  radius='md'
                  h='auto'
                  w='60'
                  src={'https://ik.imagekit.io/mublin/tr:w-130/posts/'+postImage}
                />
              </Flex>
            }
            {/* <Divider mb='sm' label='Vídeo do Youtube' labelPosition='left' />
            <TextInput
              size='md'
              mt='xs'
              type='url'
              placeholder='URL do vídeo no Youtube'
              value={formValues.video_url}
              onChange={(e) => setFormValues({...formValues, video_url: e.target.value})}
            /> */}
            <Group gap={2} mb={14}>
              <IconInfoSquareRounded color='orange' style={{width:'15px',height:'15px'}} />
              <Text size='xs' c='#56585b'>
                Estamos preparando tudo para aceitar upload de vídeos em breve!
              </Text>
            </Group>
            <Divider mb='sm' label='Adicionar card na postagem' labelPosition='left' />
            <NativeSelect
              mt='xs'
              size='sm'
              value={formValues.related_item_type}
              onChange={(e) => setFormValues({...formValues, id_item_fk: '', related_item_type: e.target.options[e.target.selectedIndex].value})}
            >
              <option value=''>Não adicionar card</option>
              <option value='project'>Adicionar card de um projeto</option>
              <option value='gear'>Adicionar card de um equipamento</option>
            </NativeSelect>
            {formValues.related_item_type && 
              <NativeSelect
                withAsterisk
                variant='filled'
                size='md'
                mt={6}
                key={form.key('id_item_fk')}
                {...form.getInputProps('id_item_fk')}
              >
                {(formValues.related_item_type === 'project') && 
                  <>
                    <option value=''>Selecione o projeto</option>
                    {projects.listBasicInfo.map((project) =>
                      <option key={project.projectid} value={project.projectid}>
                        {project.name}
                      </option>
                    )}
                  </>
                }
                {(formValues.related_item_type === 'gear') && 
                  <>
                    <option value=''>Selecione o equipamento</option>
                    {user.gear.map((gear) =>
                      <option key={gear.productId} value={gear.productId}>
                        {gear.brandName} {gear.productName}
                      </option>
                    )}
                  </>
                }
              </NativeSelect>
            }
            <Button
              fullWidth
              size='md'
              mt='md'
              type='submit'
              color='violet'
              loading={isSubmitting}
              disabled={
                !formValues.text || 
                (formValues.related_item_type && !formValues.id_item_fk)
              }
              rightSection={<IconSend size={14} />}
            >
              Publicar
            </Button>
          </form>
        </Paper>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default NewPost;