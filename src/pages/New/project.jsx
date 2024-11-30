import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Flex, Checkbox, Group, TextInput, Input, Title, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import {IKUpload} from "imagekitio-react";
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus } from '@tabler/icons-react';

function New () {

  document.title = 'Criar novo projeto | Mublin'

  const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);

  const [formData, setFormData] = useState({
    projectName: '',
    projectUserName: ''
  }) 

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      projectName: '',
      projectUserName: '',
      termsOfService: false,
    },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  // Image Upload to ImageKit.io
  const projectImagePath = "/projects/"
  const onUploadError = err => {
      alert("Ocorreu um erro. Tente novamente em alguns minutos.");
  };
  const onUploadSuccess = res => {
      let n = res.filePath.lastIndexOf('/');
      let fileName = res.filePath.substring(n + 1);
      setProjectImage(fileName)
  };

  const removeImage = () => {
      setProjectImage('')
      document.querySelector('#projectImage').value = null
  }

  return (
    <>
      <Header />
      <Container size="xs" mt={32}>
        <Title order={2} mb={14}>
          Cadastrar novo projeto
        </Title>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            withAsterisk
            label="Nome do projeto"
            placeholder="Ex: Viajantes do Espaço"
            key={form.key('projectName')}
            {...form.getInputProps('projectName')}
          />
          <TextInput
            mt={8}
            withAsterisk
            label="Username do projeto"
            placeholder="Ex: viajantesdoexpaco"
            description={
              "mublin.com/project/"+form.getValues().projectUserName
            }
            rightSection={projectUsernameAvailability?.requesting && <Loader size={20} />}
            key={form.key('projectUserName')}
            {...form.getInputProps('projectUserName')}
          />
          <Flex direction="column" mt={8}>
            <Input.Label>Foto</Input.Label>
            <IKUpload 
              id='projectImage'
              fileName="projectPicture.jpg"
              folder={projectImagePath}
              tags={["project", "avatar"]}
              useUniqueFileName={true}
              isPrivateFile= {false}
              onError={onUploadError}
              onSuccess={onUploadSuccess}
              accept="image/x-png,image/gif,image/jpeg" 
            />
          </Flex>
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
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default New;