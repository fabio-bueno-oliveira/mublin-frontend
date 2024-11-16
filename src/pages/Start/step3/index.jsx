import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Title, Text, NativeSelect, Stepper, Button, Group, Badge, Divider, rem } from '@mantine/core';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartThirdStep () {

  document.title = "Passo 3";

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  let loggedUser = JSON.parse(localStorage.getItem('user'));
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
    dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
    dispatch(miscInfos.getRoles());
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
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
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({
          userId: loggedUser.id, musicGenreId: value, musicGenreMain: setMainGenre
        })
      }).then((response) => {
        //console.log(response);
        dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
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
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({userId: loggedUser.id, userGenreId: value})
    }).then((response) => {
      //console.log(response);
      dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
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
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({
          userId: loggedUser.id, roleId: value, roleMain: setMainActivity
        })
      }).then((response) => {
        //console.log(response);
        dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
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
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({userId: loggedUser.id, userRoleId: value})
    }).then((response) => {
      //console.log(response);
      dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
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
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title ta="center" order={3} my={14}>Sua ligação com a música</Title>
        <Container size={'xs'} mt={10} mb={130}>
          <NativeSelect
            size="md"
            label="Estilos musicais"
            description="Quais os principais estilos relacionados à sua atuação na música?"
            placeholder="Selecione o gênero/estilo"
            onChange={(event) => addGenre(event.currentTarget.value)}
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
                  <>
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
                  </>
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
            onChange={(event) => addRole(event.currentTarget.value)}
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
                  <>
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
                  </>
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
          <Button variant="default" size='lg' onClick={() => goToStep2()}>Voltar</Button>
          <Button color='violet' size='lg' onClick={() => goToStep4()}>Avançar</Button>
        </Group>
      </footer>
    </>
  );
};

export default StartThirdStep;