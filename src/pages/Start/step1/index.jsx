import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../../store/actions/user';
import { Container, Stepper, Group, Center, Title, Image, Button, Loader, Avatar } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight, IconUpload } from '@tabler/icons-react';
import {IKUpload} from "imagekitio-react";
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  document.title = "Passo 1";

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')

  const userAvatarPath = "/users/avatars/"

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
          dispatch(userActions.getInfo());
        })
      }).catch(err => {
        console.error(err)
      })
  };

  const onUploadError = err => {
    alert("Ocorreu um erro. Tente novamente em alguns minutos.");
  };

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToIntro = () => {
    navigate('/start/intro/');
  }

  const [uploading, setUploading] = useState(false);

  const onUploadStart = evt => {
    console.log("Start uplading", evt);
    setUploading(true);
  };

  const onUploadSuccess = res => {
    notifications.show({
      title: 'Sucesso!',
      message: 'Foto de perfil carregada com sucesso!',
      color: 'lime',
      position: 'top-center'
    })
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    updatePicture(user.id,fileName);
    setUploading(false);
  };

  const onUploadProgress = progress => {
    console.log("Progress", progress);
  };

  return (
    <>
      <HeaderWelcome />
      <Container size='lg' mt={largeScreen ? 20 : 8}>
        <Stepper color='mublinColor' active={0} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
        </Stepper>
        <Title ta="center" order={3} my={14}>Defina sua foto de perfil</Title>
        <Center mt={30}>
          {uploading || user.requesting ? (
            <Loader color='mublinColor' size={80} />
          ) : (
            <>
              {!user.picture ? (
                <Avatar 
                  src='https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'
                  size={100} 
                />
              ) : (
                <Avatar 
                  src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+user.picture} 
                  size={100} 
                />
              )}
            </>
          )}
        </Center>
        <div className="customFileUpload">
          <IKUpload 
            fileName={`${user.username}.jpg`}
            validateFile={file => file.size < 2000000}
            folder={userAvatarPath}
            tags={['avatar','user']}
            name='file-input'
            id='file-input'
            className='file-input__input'
            useUniqueFileName={true}
            isPrivateFile= {false}
            onUploadProgress={onUploadProgress}
            onError={onUploadError}
            onSuccess={onUploadSuccess}
            onUploadStart={onUploadStart}
          />
          <Center>
            <label className="file-input__label" htmlFor="file-input">
              <IconUpload />
              <span>Selecionar arquivo</span>
            </label>
          </Center>
        </div>
      </Container>
      <footer className='onFooter'>
        <Group justify="center">
          <Button 
            variant="default" 
            size='lg'
            onClick={() => goToIntro()}
            leftSection={<IconArrowLeft size={14} />}  
          >
            Voltar
          </Button>
          {user.picture ? (
            <Button 
              color='mublinColor' 
              size='lg'
              onClick={() => goToStep2()} 
              disabled={uploading}
              rightSection={<IconArrowRight size={14} />}
            >
              Avançar
            </Button>
          ) : (
            <Button 
              color='mublinColor'
              size='lg'
              onClick={() => goToStep2()}
              rightSection={<IconArrowRight size={14} />}
            >
              Pular
            </Button>
          )}
        </Group>
      </footer>
    </>
  );
};

export default StartFirstStep;