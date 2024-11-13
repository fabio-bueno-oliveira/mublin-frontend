import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Title, MultiSelect, Select, Stepper, Button, Group, Autocomplete, Paper, Pill, rem } from '@mantine/core';
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

  useEffect(() => { 
    dispatch(miscInfos.getMusicGenres());
    dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
    dispatch(miscInfos.getRoles());
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
  }, []);

  const [value, setValue] = useState('');

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
  const rolesList = roles?.list
    // .filter(e => !userSelectedRoles.includes(e.id))
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
        method: 'post',
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
      method: 'delete',
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

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToStep4 = () => {
    navigate('/start/step4');
  }

  const loadedGenresInfos = (user.genresLoadingSuccess && user.success && genres.success);

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
        <Title ta="center" order={5} my={14}>Sua ligação com a música</Title>
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
            disabled={isAddingGenre || isDeletingGenre}
          />
          <Group my={14} gap={5}>
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
          {/* <MultiSelect
            label="Estilos musicais"
            description="Quais os principais estilos musicais relacionados à sua atuação na música?"
            placeholder={loadedGenresInfos ? "Selecione até 10" : "Carregando..."}
            data={musicGenresList}
            maxValues={10}
            searchable
            // onChange={(_value) => addGenre(_value, 'add')}
            onRemove={(_value) => deleteGenre(_value, 'delete')}
            onSelect={(_value, option) => console.log(option)}
            disabled={isLoading}
            value={loadedGenresInfos ? userSavedGenres : []}
            defaultValue={loadedGenresInfos ? userSavedGenres : []}
          /> */}
          
          <Select
            label="Atuação na música" 
            description="Quais suas principais atividades/atuações na música?"
            placeholder="Selecione a atividade"
            data={rolesList}
            // value={value ? value.value : null}
            onChange={(_value) => addGenre(_value)}
            searchable
            withCheckIcon={false}
            disabled={isAddingGenre || isDeletingGenre}
          />
          <Group my={14} gap={5}>
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
                    onRemove={() => deleteGenre(role.id)} 
                  >
                    {role.name}
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

          {/* <Select
            mt={20}
            label="Atuação na música" 
            description="Quais suas principais atividades/atuações na música?"
            placeholder="Selecione ou digite"
            data={rolesList}
            searchable
          /> */}
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