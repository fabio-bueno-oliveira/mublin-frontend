import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../store/actions/user';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Box, Title, Text, NativeSelect, Stepper, Button, Group, Badge, Divider, rem } from '@mantine/core';
import { IconArrowRight, IconArrowLeft, IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartThirdStep () {

  document.title = "Passo 3";

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const user = useSelector(state => state.user);
  const genresCategories = useSelector(state => state.musicGenres.categories);
  const genres = useSelector(state => state.musicGenres);
  const roles = useSelector(state => state.roles);

  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [isDeletingGenre, setIsDeletingGenre] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  useEffect(() => { 
    dispatch(miscInfos.getMusicGenres());
    dispatch(miscInfos.getMusicGenresCategories());
    dispatch(userInfos.getUserGenresInfoById(userInfo.id));
    dispatch(miscInfos.getRoles());
    dispatch(userInfos.getUserRolesInfoById(loggedUserId));
  }, []);

  const userGenres = user.genres;
  const userRoles = user.roles;

  const userSelectedGenres = user.genres?.map(e => { return e.idGenre });
  const musicGenresList = genres?.list
    // .filter(e => !userSelectedGenres.includes(e.id))
    .map(genre => ({ 
      label: genre.name,
      value: String(genre.id),
      disabled: userSelectedGenres.includes(genre.id),
      categoryId: genre.categoryId
    }));

  const userSelectedRoles = user.roles.map(item => item.idRole);
  const rolesListMusicians = roles?.list
    .filter(e => e.instrumentalist)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
      disabled: userSelectedRoles.includes(role.id)
    }));
  const rolesListManagement = roles?.list
    .filter(e => !e.instrumentalist)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
      disabled: userSelectedRoles.includes(role.id)
    }));

  const addGenre = (value) => {
    setIsAddingGenre(true)
    let setMainGenre
    if (!user.genres[0].idGenre) { setMainGenre = 1 } else { setMainGenre = 0 }
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/add/musicGenre', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          userId: loggedUserId, musicGenreId: value, musicGenreMain: setMainGenre
        })
      }).then((response) => {
        //console.log(response);
        dispatch(userInfos.getUserGenresInfoById(loggedUserId));
        setIsAddingGenre(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao adicionar o gênero");
        setIsAddingGenre(false);
      })
    }, 400);
  }

  const deleteGenre = (value) => {
    setIsDeletingGenre(true)
    fetch('https://mublin.herokuapp.com/user/delete/musicGenre', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userGenreId: value})
    }).then((response) => {
      //console.log(response);
      dispatch(userInfos.getUserGenresInfoById(loggedUserId));
      setIsDeletingGenre(false);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao remover o gênero");
      setIsDeletingGenre(false);
    })
  }

  const addRole = (value) => {
    setIsAddingRole(true)
    let setMainActivity
    if (!user.roles[0].idRole) { setMainActivity = 1 } else { setMainActivity = 0 }
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/add/role', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          userId: loggedUserId, roleId: value, roleMain: setMainActivity
        })
      }).then((response) => {
        //console.log(response);
        dispatch(userInfos.getUserRolesInfoById(loggedUserId));
        setIsAddingRole(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao adicionar a atividade");
        setIsAddingRole(false);
      })
    }, 400);
  }

  const deleteRole = (value) => {
    setIsDeletingRole(true)
    fetch('https://mublin.herokuapp.com/user/delete/role', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userRoleId: value})
    }).then((response) => {
      //console.log(response);
      dispatch(userInfos.getUserRolesInfoById(loggedUserId));
      setIsDeletingRole(false);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao remover a atividade");
      setIsDeletingRole(false);
    })
  }

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToStep4 = () => {
    navigate('/start/step4');
  }

  const xIconStyle = { width: '10px', height: '10px', cursor:'pointer' };

  return (
    <>
      <HeaderWelcome />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={2} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
        </Stepper>
        <Title ta="center" order={3} my={14}>Sua ligação com a música</Title>
        <Container size={'xs'} mt={10} mb={130}>
          <NativeSelect
            size="md"
            label="Estilos musicais"
            description="Quais os principais estilos relacionados à sua atuação na música?"
            placeholder="Selecione o gênero/estilo"
            onChange={(e) => addGenre(e.currentTarget.value)}
            disabled={isAddingGenre || isDeletingGenre || genres.requesting}
            mb={!userGenres[0].id && 18}
          >
            <option value=''>
              {genres.requesting ? "Carregando..." : "Selecione"}
            </option>
            {genresCategories.map((category, key) => 
              <optgroup label={category.name_ptbr} key={key}>
                {musicGenresList
                  .filter(e => e.categoryId === category.id)
                  .map((genre, key) => 
                    <option key={key} disabled={genre.disabled} value={genre.value}>
                      {genre.label}
                    </option>
                )}
              </optgroup>
            )}
          </NativeSelect>
          {userGenres[0].id && 
            <>
              <Text size={'xs'} mt='xs' mb={6}>
                {userGenres.length} {userGenres.length === 1 ? "selecionado:" : "selecionados:"}
              </Text>
              <Group mb={16} gap={5}>
                {userGenres.map((genre, key) =>
                  <Box key={key}>
                    {/* <Pill 
                      key={key} 
                      withRemoveButton 
                      onRemove={() => deleteGenre(genre.id)} 
                    >
                      {genre.name}
                    </Pill> */}
                    <Badge 
                      color="violet"
                      variant='filled'
                      size='sm'
                      rightSection={
                        <IconX 
                          style={xIconStyle} 
                          stroke={3} 
                          onClick={() => deleteGenre(genre.id)} 
                        />
                      }
                    >
                      {genre.name}
                    </Badge>
                  </Box>
                )}
                {isAddingGenre &&
                  <Badge variant="light" color="violet" size="sm">
                    Salvando...
                  </Badge>
                }
              </Group>
            </>
          }
          <Divider my="sm" />
          <NativeSelect
            size="md"
            label="Atuação na música"
            description="Quais suas principais atividades na música?"
            placeholder="Selecione a atividade"
            onChange={(e) => addRole(e.currentTarget.value)}
            data={[
              { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
              { group: 'Gestão, produção e outros', items: rolesListManagement },
              { group: 'Instrumentos', items: rolesListMusicians },
            ]}
            disabled={isAddingRole || isDeletingRole || roles.requesting}
          />
          {userRoles[0].id && 
            <>
              <Text size={'xs'} mt='xs' mb={6}>
                {userRoles.length} {userRoles.length === 1 ? "selecionado:" : "selecionados:"}
              </Text>
              <Group mb={12} gap={5}>
                {userRoles.map((role, key) =>
                  <Box key={key}>
                    {/* <Pill 
                      key={key} 
                      withRemoveButton 
                      onRemove={() => deleteRole(role.id)} 
                    >
                      {role.name}
                    </Pill> */}
                    <Badge 
                      color="violet"
                      variant='filled'
                      size='sm'
                      rightSection={
                        <IconX 
                          style={xIconStyle} 
                          stroke={3} 
                          onClick={() => deleteRole(role.id)} 
                        />
                      }
                    >
                      {role.name}
                    </Badge>
                  </Box>
                )}
                {isAddingRole &&
                  <Badge variant="light" color="violet" size="sm">
                    Salvando...
                  </Badge>
                }
              </Group>
            </>
          }
        </Container>
      </Container>
      <footer className='onFooter'>
        <Group justify="center">
          <Button 
            variant="default"
            size='lg'
            leftSection={<IconArrowLeft size={14} />}
            onClick={() => goToStep2()}
          >
            Voltar
          </Button>
          <Button 
            color='violet'
            size='lg'
            rightSection={<IconArrowRight size={14} />}
            onClick={() => goToStep4()}
          >
            Avançar
          </Button>
        </Group>
      </footer>
    </>
  );
};

export default StartThirdStep;