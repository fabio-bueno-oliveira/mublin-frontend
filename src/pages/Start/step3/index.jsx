import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Input, Title, MultiSelect, Select, Stepper, Button, Group, rem } from '@mantine/core';
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { 
    dispatch(miscInfos.getMusicGenres());
    dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
    dispatch(miscInfos.getRoles());
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
  }, []);

  const userSelectedGenres = user.genres.map(item => item.idGenre);
  const userSelectedGenres2 = user.genres.map(e => { return { value: String(e.value), label: e.text }});
  const musicGenresList = genres?.list.filter(e => !userSelectedGenres.includes(e.id)).map(genre => ({ 
    label: genre.name,
    value: String(genre.id)
  }));

  const userSelectedRoles = user.roles.map(item => item.idRole);
  const rolesList = roles?.list.filter(e => !userSelectedRoles.includes(e.id)).map(role => ({ 
    label: role.name,
    value: String(role.id)
  }));

  const addGenre = (musicGenreId) => {
    setIsLoading(true)
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
          userId: loggedUser.id, musicGenreId: musicGenreId, musicGenreMain: setMainGenre
        })
      }).then((response) => {
        //console.log(response);
        dispatch(userInfos.getUserGenresInfoById(loggedUser.id));
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao adicionar o gênero");
        setIsLoading(false);
      })
    }, 400);
  }

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToStep4 = () => {
    navigate('/start/step4');
  }

  const [value, setValue] = useState([]);
  console.log(80, value)

  useEffect(() => { 
    if (value.length) {
      addGenre(value.at(-1));
    }
  }, [value]);

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

          <MultiSelect
            label="Estilos musicais"
            description="Quais os principais estilos musicais relacionados à sua atuação na música?"
            placeholder="Selecione até 4"
            data={musicGenresList}
            maxValues={4}
            searchable
            // onChange={(e, { value }) => addGenre(value)}
            onChange={setValue}
            disabled={isLoading}
          />

          <Select
            mt={20}
            label="Estilos musicais" 
            description="Quais os principais estilos musicais relacionados à sua atuação na música?"
            placeholder="Selecione ou digite"
            data={musicGenresList}
            onChange={(e, { value }) => addGenre(value)}
            searchable
          />

          <Select
            mt={20}
            label="Atuação na música" 
            description="Quais suas principais atividades/atuações na música?"
            placeholder="Selecione ou digite"
            data={rolesList}
            searchable
          />

        </Container>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={() => goToStep2()}>Voltar</Button>
          <Button color='violet' onClick={() => goToStep4()}>Avançar</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartThirdStep;