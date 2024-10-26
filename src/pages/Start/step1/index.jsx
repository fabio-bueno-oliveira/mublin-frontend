import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { Container, Stepper, Group, Center, Image, Button, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {IKUpload} from "imagekitio-react";
import Header from '../../../components/header';

function StartFirstStep () {

  document.title = "Passo 1 de 4";
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => { 
  //   dispatch(userInfos.getInfo());
  // }, []);

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

  return (
    <>
      <Header />
      <Container size={'lg'} mt={20}>
        <Stepper color="violet" active={0} size={largeScreen ? "sm" : "xs"} orientation={largeScreen ? "horizontal" : "vertical"}>
          <Stepper.Step label="Passo 1" description="Defina sua foto de perfil" />
          <Stepper.Step label="Passo 2" description="Conte um pouco sobre você">
            Passo 2: Conte um pouco sobre você
          </Stepper.Step>
          <Stepper.Step label="Passo 3" description="Sua ligação com a música">
            Passo 3: Sua ligação com a música
          </Stepper.Step>
          <Stepper.Step label="Passo 4" description="Seus projetos musicais">
            Passo 4: Seus projetos musicais
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
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
        <Group justify="center" mt="xl">
          {isLoading && <Loader size={23} />}
          {user.picture ? (
            <Button color='violet'  onClick={() => goToStep2()} disabled={!user.picture}>Avançar</Button>
          ) : (
            <Button variant="default" onClick={() => goToStep2()}>Pular por enquanto</Button>
          )}
        </Group>
      </Container>
    </>
  );
};

export default StartFirstStep;