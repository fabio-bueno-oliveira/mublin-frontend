import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { userProjectsInfos } from '../../../store/actions/userProjects';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Modal, Flex, Center, Title, Text, Input, Stepper, Button, Group, TextInput, NativeSelect, Radio, Avatar, ActionIcon, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconWorld, IconLock, IconSearch, IconX } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';
import useEmblaCarousel from 'embla-carousel-react';
import './styles.scss';

function StartFourthStep () {

  document.title = "Passo 4";

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector(state => state.user);
  const userProjects = useSelector(state => state.userProjects);
  // const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';
  const cdnPath = 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/';

  useEffect(() => { 
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(miscInfos.getRoles());
  }, [loggedUser.id]);

  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);

  const [emblaRef1] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: false, 
      align: 'center' 
    }
  )

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

  const goToStep3 = () => {
    navigate('/start/step3');
  }

  const goToHome = () => {
    navigate('/home');
  }

  return (
    <>
      <HeaderWelcome />
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
          <Group align="end" gap={10}>
            <Text>Pesquise abaixo</Text>
            <Button 
              variant='outline' 
              color='violet' 
              size="xs"
              mt={10}
              onClick={() => setModalNewProjectOpen(true)}
            >
              ou cadastrar novo projeto
            </Button>
          </Group>
        </Center>
        <Center mt={18}>
          <Input
            w={370}
            size='md'
            leftSection={<IconSearch size={16} />}
            placeholder="Digite o nome do projeto ou banda..."
            onChange={e => handleSearchChange(e.target.value)}
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
      <footer className='onFooter step4Page'>
        <Container className="embla projects" ref={emblaRef1}>
          <div className="embla__container">
            {userProjects.list.map((project, key) =>
              <Flex gap={3} align={'center'} key={key} className="embla__slide">
                <Avatar 
                  src={project.picture ? cdnPath+project.picture : undefined} 
                  alt={project.name}
                />
                <Flex 
                  direction={'column'}
                  justify="flex-start"
                  align="flex-start"
                  wrap="wrap"
                >
                  <Text size='13px' fw={500}>{project.name}</Text>
                  <Text size='11px' c="dimmed">{project.ptname}</Text>
                  <Text size='10px' c="dimmed">{project.workTitle}</Text>
                  <ActionIcon variant="filled" color="red" size="xs" mt={4}>
                    <IconX style={{ width: '70%', height: '70%' }} stroke={1.9} />
                  </ActionIcon>
                </Flex>
              </Flex>
            )}
          </div>
        </Container>
        <Group justify="center" mt="xl">
          <Button variant='default' size='lg' onClick={() => goToStep3()}>Voltar</Button>
          <Button color='violet' size='lg' onClick={() => goToHome()}>Concluir</Button>
        </Group>
      </footer>
    </>
  );
};

export default StartFourthStep;