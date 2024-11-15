import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Modal, Center, Title, Text, Input, Stepper, Button, Group, TextInput, NativeSelect, Radio, Autocomplete, Avatar, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconWorld, IconLock } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import Header from '../../../components/header';

function StartFourthStep () {

  document.title = "Passo 4";

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector(state => state.user);
  const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';

  useEffect(() => { 
    // dispatch(userInfos.getUserProjects(loggedUser.id));
    dispatch(miscInfos.getRoles());
  }, [loggedUser.id, dispatch]);

  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const [query, setQuery] = useState('')
  const [lastQuery, setLastQuery] = useState('')

  const handleSearchChange = (e) => {
    setQuery(e)
    if (e.length > 1 && query !== lastQuery) {
        setTimeout(() => {
            dispatch(searchInfos.getSearchProjectResults(e))
        }, 700)
        setLastQuery(e)
    }
  }

  const usersData = {
    'Rolling Stones': {
      image: 'https://akamai.sscdn.co/tb/letras-blog/wp-content/uploads/2020/11/bfc87c9-rolling-stones.jpg',
      projectType: 'Banda',
    },
    'Beatles': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Beatles_ad_1965_just_the_beatles_crop.jpg',
      projectType: 'Banda',
    },
    'Korn': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Korn%2C_2013.jpg',
      projectType: 'Banda',
    }
  };

  const renderAutocompleteOption = ({ option }) => (
    <Group gap="sm">
      <Avatar src={usersData[option.value].image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {usersData[option.value].projectType}
        </Text>
      </div>
    </Group>
  );

  const goToStep3 = () => {
    navigate('/start/step3');
  }

  const goToHome = () => {
    navigate('/home');
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={3} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title ta="center" order={3} mt={14} mb={1}>Seus projetos musicais</Title>
        <Text ta="center" order={5} mb={20}>
          De quais projetos ou bandas você participa ou já participou?
        </Text>
        <Center>
          <Group align="end">
            <Text>Pesquise abaixo</Text>
            <Button 
              variant='outline' 
              color='violet' 
              size="xs"
              mt={10}
              onClick={() => setModalNewProjectOpen(true)}
            >
              ou cadastre um novo projeto
            </Button>
          </Group>
        </Center>
        <Center mt={18}>
          {/* <Input 
            w={300} 
            placeholder="Digite o nome do projeto ou banda..." 
            onChange={e => handleSearchChange(e.target.value)}
          /> */}
          <Autocomplete
            w={300} 
            data={[
              'Rolling Stones', 'Beatles', 'Korn'
            ]}
            renderOption={renderAutocompleteOption}
            maxDropdownHeight={116}
            placeholder="Digite o nome do projeto ou banda..." 
          />
        </Center>
        <Container size={'md'} mt={10} mb={130}>
          
        </Container>
      </Container>
      <Modal 
        opened={modalNewProjectOpen} 
        onClose={() => setModalNewProjectOpen(false)} 
        title="Cadastrar novo projeto" 
        centered
        size={'lg'}
      >
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            label="Nome do projeto"
            placeholder="Ex: Viajantes do Espaço"
            mb={5}
            key={form.key('name')}
            {...form.getInputProps('name')}
          />

          <NativeSelect
            label="Tipo do projeto"
            placeholder="Escolha o Estado"
            mb={5}
          >
            <option value='2'>Banda</option>
            <option value='3'>Projeto</option>
            <option value='1'>Artista Solo</option>
            <option value='8'>DJ</option>
            <option value='4'>Duo</option>
            <option value='5'>Trio</option>
            <option value='7'>Ideia</option>
          </NativeSelect>

          <NativeSelect
            label="Conteúdo"
            mb={5}
          >
            <option value='1'>Autoral</option>
            <option value='2'>Cover</option>
            <option value='3'>Autoral + Cover</option>
          </NativeSelect>

          <Radio.Group
            name="favoriteFramework"
            label="Visibilidade"
            description="Visibilidade do perfil no Mublin"
            value={"1"}
          >
            <Group mt="xs">
              <Radio 
                color='violet' 
                value="1" 
                label={<Group gap={2}><IconWorld style={{ width: rem(18), height: rem(18) }} /> Público</Group>} 
                checked 
              />
              <Radio 
                color='violet' 
                value="0"
                label={<Group gap={2}><IconLock style={{ width: rem(18), height: rem(18) }} /> Privado</Group>}  
              />
            </Group>
          </Radio.Group>

          <Group justify="flex-end" mt="md">
            <Button type="submit" color='violet'>Cadastrar</Button>
          </Group>
        </form>
      </Modal>
      <footer className='onFooter'>
        <Group justify="center" mt="xl">
          <Button variant='default' size='lg' onClick={() => goToStep3()}>Voltar</Button>
          <Button color='violet' size='lg' onClick={() => goToHome()}>Concluir</Button>
        </Group>
      </footer>
    </>
  );
};

export default StartFourthStep;