import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Title, Text, Select, NativeSelect, Stepper, Button, Group, Pill, Divider, rem } from '@mantine/core';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4 } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartThirdStep () {

  document.title = "Passo 3";

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  let loggedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector(state => state.user);
  const genres = useSelector(state => state.musicGenres);
  const roles = useSelector(state => state.roles);

  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [isDeletingGenre, setIsDeletingGenre] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  useEffect(() => { 
    dispatch(miscInfos.getMusicGenres());
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
      disabled: userSelectedGenres.includes(genre.id)
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

  const [value, setValue] = useState('');

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
          <Select
            label="Estilos musicais"
            description="Quais os principais estilos musicais relacionados à sua atuação na música?"
            placeholder="Selecione o gênero/estilo"
            data={musicGenresList}
            // value={value ? value.value : null}
            onChange={(_value) => addGenre(_value)}
            searchable
            withCheckIcon={false}
            withScrollArea={false}
            styles={{ 
              dropdown: { maxHeight: 96, overflowY: 'auto' } 
            }}
            disabled={isAddingGenre || isDeletingGenre}
          />
          <Container my={10} p={0}>
            <NativeSelect
              label="Estilos musicais"
              description="Quais os principais estilos musicais relacionados à sua atuação na música?"
              placeholder="Selecione o gênero/estilo"
              value={value}
              onChange={(event) => addGenre(event.currentTarget.value)}
              data={musicGenresList}
              disabled={isAddingGenre || isDeletingGenre}
            />
          </Container>
          {userGenres[0].id && 
            <>
              <Text size={'xs'} mt='xs' mb={6}>
                {userGenres.length} {userGenres.length === 1 ? "selecionado:" : "selecionados:"}
              </Text>
              <Group mb={12} gap={5}>
                {user.requesting ? (
                  <Pill c={'dimmed'}>
                    Carregando estilos selecionados...
                  </Pill>
                ) : (
                  <>
                    {userGenres.map((genre, key) =>
                      <Pill 
                        key={key} 
                        withRemoveButton 
                        onRemove={() => deleteGenre(genre.id)} 
                      >
                        {genre.name}
                      </Pill>
                    )}
                    {isAddingGenre &&
                      <Pill c={'blue'}>
                        Salvando...
                      </Pill>
                    }
                    {isDeletingGenre &&
                      <Pill c={'red'}>
                        Removendo...
                      </Pill>
                    }
                  </>
                )}
              </Group>
            </>
          }
          <Divider my="sm" />
          <Select
            label="Atuação na música" 
            description="Quais suas principais atividades na música?"
            placeholder="Selecione a atividade"
            data={[
              { group: 'Gestão, produção e outros', items: rolesListManagement },
              { group: 'Instrumentos', items: rolesListMusicians },
            ]}
            // value={value ? value.value : null}
            onChange={(_value) => addRole(_value)}
            searchable
            withCheckIcon={false}
            withScrollArea={false}
            styles={{ 
              dropdown: { maxHeight: 96, overflowY: 'auto' } 
            }}
            disabled={isAddingRole || isDeletingRole}
          />
          <Container my={10} p={0}>
            <NativeSelect
              label="Atuação na música" 
              description="Quais suas principais atividades na música?"
              placeholder="Selecione a atividade"
              value={value}
              onChange={(event) => addRole(event.currentTarget.value)}
              data={[
                { group: 'Gestão, produção e outros', items: rolesListManagement },
                { group: 'Instrumentos', items: rolesListMusicians },
              ]}
              disabled={isAddingRole || isDeletingRole}
            />
          </Container>
          {userRoles[0].id && 
            <>
              <Text size={'xs'} mt='xs' mb={6}>
                {userRoles.length} {userRoles.length === 1 ? "selecionado:" : "selecionados:"}
              </Text>
              <Group mb={14} gap={5}>
                {user.requesting ? (
                  <Pill c={'dimmed'}>
                    Carregando atividades selecionadas...
                  </Pill>
                ) : (
                  <>
                    {userRoles.map((role, key) =>
                      <Pill 
                        key={key} 
                        withRemoveButton 
                        onRemove={() => deleteRole(role.id)} 
                      >
                        {role.name}
                      </Pill>
                    )}
                    {isAddingRole &&
                      <Pill c={'blue'}>
                        Salvando...
                      </Pill>
                    }
                    {isDeletingRole &&
                      <Pill c={'red'}>
                        Removendo...
                      </Pill>
                    }
                  </>
                )}
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