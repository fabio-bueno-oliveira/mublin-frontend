import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { Container, Stepper, Group, Center, Title, Image, Button, Loader, rem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import {IKUpload} from "imagekitio-react";
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  document.title = "Passo 1";
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  // Image Upload to ImageKit.io
  const userAvatarPath = "/users/avatars/"+user.id+"/"
  const [isLoading, SetIsLoading] = useState(false)

  // Update avatar filename in bd
  const updatePicture = (userId, value) => {
    SetIsLoading(true)
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
          //console.log(response);
          SetIsLoading(false)
          dispatch(userInfos.getInfo());
        })
      }).catch(err => {
        SetIsLoading(false)
        console.error(err)
      })
  };

  const onUploadError = err => {
    alert("Ocorreu um erro. Tente novamente em alguns minutos.");
  };

  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    updatePicture(user.id,fileName)
  };

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToIntro = () => {
    navigate('/start/intro/');
  }

  return (
    <>
      <HeaderWelcome />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={0} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title ta="center" order={5} my={14}>Defina sua foto de perfil</Title>
        <Center mt={30}>
          {!user.picture ? (
            <Image radius={'md'} src='https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' w={100} />
          ) : (
            <Image radius={'md'} src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture} w={100} />
          )}
        </Center>
        <div className="customFileUpload">
          <IKUpload 
            fileName="avatar.jpg"
            folder={userAvatarPath}
            tags={["tag1"]}
            useUniqueFileName={true}
            isPrivateFile= {false}
            onError={onUploadError}
            onSuccess={onUploadSuccess}
          />
        </div>
      </Container>
      <footer className='onFooter'>
        <Group justify="center">
          {isLoading && <Loader size={23} />}
          <Button variant="default" onClick={() => goToIntro()}
            leftSection={<IconArrowLeft size={14} />}  
          >
            Voltar
          </Button>
          {user.picture ? (
            <Button 
              color='violet' 
              onClick={() => goToStep2()} 
              disabled={!user.picture}
              rightSection={<IconArrowRight size={14} />}
            >
              Avançar
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={() => goToStep2()}
              rightSection={<IconArrowRight size={14} />}
            >
              Pular por enquanto
            </Button>
          )}
        </Group>
      </footer>
    </>
  );
};

export default StartFirstStep;