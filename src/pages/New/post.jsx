import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../store/actions/user'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { Container, Flex, Image, Textarea, NativeSelect, Title, Button, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import {IKUpload} from "imagekitio-react";
import { IconTrash, IconSend } from '@tabler/icons-react';
import { format } from 'date-fns';

function NewPost () {

  const dispatch = useDispatch()

  document.title = 'Novo post | Mublin'

  let loggedUser = JSON.parse(localStorage.getItem('user'))
  let navigate = useNavigate()

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postImage, setPostImage] = useState('')

  useEffect(() => {
    dispatch(userInfos.getUserGearInfoById(loggedUser.id))
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUser.id))
  }, []);

  const [formValues, setFormValues] = useState({
    id_item_fk: '',
    related_item_type: '',
    id_feed_type_fk: '',
    extra_text: '',
    image: ''
  })

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      id_item_fk: '',
      id_feed_type_fk: '',
      extra_text: ''
    },

    onValuesChange: (values) => {
      setFormValues({
        ...formValues,
        extra_text: values.extra_text,
        id_item_fk: values.id_item_fk
      })
    },
  });

  // Image upload to imagekit.io
  const postsImagePath = '/posts/'
  const onUploadError = err => {
      alert("Ocorreu um erro ao enviar a imagem do projeto. Tente novamente em alguns minutos.");
  };
  const onUploadSuccess = res => {
      let n = res.filePath.lastIndexOf('/');
      let fileName = res.filePath.substring(n + 1);
      setPostImage(fileName);
  };

  const removeImage = () => {
    setPostImage('');
    document.querySelector('#postImage').value = null;
  }

  const handleSubmitNewPost = (values) => {
    setIsSubmitting(true);
    fetch('https://mublin.herokuapp.com/feed/newPost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      },  
      body: JSON.stringify({ id_user_1_fk: loggedUser.id, id_item_fk: values.id_item_fk, related_item_type: formValues.related_item_type, id_feed_type_fk: 8, extra_text: values.extra_text, image: postImage ? postImage : '' })
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

  return (
    <>
      <Header />
      <Container size="xs" mt={32} mb={40}>
        <Title order={2} fw='450' mb={24} ta="center">
          Nova post
        </Title>
        <form onSubmit={form.onSubmit(handleSubmitNewPost)}>
          <Textarea
            mt={8}
            size='md'
            placeholder="Escreva algo..."
            maxLength="1000"
            autosize
            minRows={4}
            maxRows={8}
            key={form.key('extra_text')}
            {...form.getInputProps('extra_text')}
          />
          <Divider mt='lg' mb='sm' label='Imagem' labelPosition='center' />
          <Flex direction="column">
            <div style={postImage ? {display: "none"} : undefined}>
              <IKUpload 
                id='postImage'
                fileName={`post_user-${loggedUser.id}_${format(new Date(), 'yyyy-MM-dd-HH:mm:ssXX')}.jpg`}
                folder={postsImagePath}
                tags={["post"]}
                useUniqueFileName={true}
                isPrivateFile= {false}
                onError={onUploadError}
                onSuccess={onUploadSuccess}
                accept="image/x-png,image/gif,image/jpeg" 
              />
            </div>
          </Flex>
          {postImage && 
            <Flex gap={10}>
              <Image 
                radius='md'
                h='auto'
                w='130'
                src={'https://ik.imagekit.io/mublin/tr:w-130/posts/'+postImage} 
              /> 
              <Button 
                size='xs' 
                color='red' 
                onClick={() => removeImage()}
                leftSection={<IconTrash size={14} />}
              >
                Remover
              </Button>
            </Flex>
          }
          <Divider mt='lg' mb='lg' label='Menção (opcional)' labelPosition='center' />
          <NativeSelect
            value={formValues.related_item_type}
            onChange={(e) => setFormValues({...formValues, id_item_fk: '', related_item_type: e.target.options[e.target.selectedIndex].value})}
          >
            <option value=''>Nenhuma menção</option>
            <option value='project'>Mencionar um projeto</option>
            <option value='gear'>Mencionar um equipamento</option>
          </NativeSelect>
          {formValues.related_item_type && 
            <NativeSelect
              withAsterisk
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
              !formValues.extra_text || 
              (formValues.related_item_type && !formValues.id_item_fk)
            }
            rightSection={<IconSend size={14} />}
          >
            Postar
          </Button>
        </form>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default NewPost;