import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { miscInfos } from '../../store/actions/misc'
import { projectInfos } from '../../store/actions/project'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { searchInfos } from '../../store/actions/search'
import { Container, Flex, Grid, Modal, Alert, Center, NumberInput, ScrollArea, Avatar, Text, Anchor, Checkbox, Badge, Group, ActionIcon, Image, Input, NativeSelect, Radio, Title, Button, Loader, Divider, ThemeIcon, rem } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Helmet } from 'react-helmet'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { IconIdBadge2, IconCheck, IconSearch, IconX, IconClock } from '@tabler/icons-react'
import ModalDeleteParticipationContent from '../Start/step4/modalDeleteParticipation';
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function New () {

  const dispatch = useDispatch()

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const user = useSelector(state => state.user)
  const project = useSelector(state => state.project)
  const roles = useSelector(state => state.roles)
  const searchProject = useSelector(state => state.searchProject)
  const userProjects = useSelector(state => state.userProjects)
  const members = project.members.filter((member) => { return member.confirmed === 1 })

  const avatarCDNPath = 'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/'
  const cdnPath = 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  useEffect(() => { 
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
    dispatch(miscInfos.getRoles());
  }, [userInfo.id]);

  const [query, setQuery] = useState('')

  const [modalProjectInfo, setModalProjectInfo] = useState('');
  const [modalProjectTitle, setModalProjectTitle] = useState('');
  const [modalProjectType, setModalProjectType] = useState('');
  const [modalProjectImage, setModalProjectImage] = useState('');
  const [modalProjectFoundationYear, setModalFoundationYear] = useState('');
  const [modalProjectEndYear, setModalEndYear] = useState('');

  const [modalOpen, setModalOpen] = useState(false);

  const closeModalParticipation = () => {
    setModalOpen(false);
    setMainRole('');
  }

  const rolesListMusicians = roles?.list
    .filter(e => e.instrumentalist && e.appliesToProject)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
    }));
  const rolesListManagement = roles?.list
    .filter(e => !e.instrumentalist && e.appliesToProject)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
    }));

  const formSearch = useForm({
    mode: 'uncontrolled'
  });

  // campos do form para relacionar usuário a um projeto
  const [projectId, setProjectId] = useState('')
  const [active, setActive] = useState('1')
  const [checkbox, setCheckbox] = useState(false)
  const [featured, setFeatured] = useState(true)
  const [status, setStatus] = useState('1')
  const [mainRole, setMainRole] = useState('')
  const [joinedIn, setJoinedIn] = useState('')
  const [leftIn, setLeftIn] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleSearchChange = () => {
    if (query.length > 1) {
      dispatch(searchInfos.getSearchProjectResults(query))
    } else {
      alert("Digite ao menos 2 caracteres!");
    }
  }

  const handleResultSelect = (result) => {
    dispatch(projectInfos.getProjectMembers(result.username));
    setProjectId(result.id)
    setModalProjectInfo(result.description)
    setModalProjectTitle(result.title)
    setModalProjectType(result.type)
    setModalFoundationYear(result.foundation_year)
    setJoinedIn(result.foundation_year)
    setLeftIn(result.foundation_year)
    setModalEndYear(result.end_year ? result.end_year : "")
    setModalProjectImage(result.image)
    setModalOpen(true)
  }

  // Modal Delete Participation on Project
  const [modalDeleteConfirmationOpen, setModalDeleteConfirmationOpen] = useState(false);
  const [modalDeleteData, setModalDeleteData] = useState({});
  const handleDeleteParticipation = (project) => {
    setModalDeleteData(project);
    setModalDeleteConfirmationOpen(true);
  }
  const adminsModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin);
  const myselfAdminModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin && m.userId === loggedUserId);

  const handleCheckbox = (x) => {
    setCheckbox(value => !value);
    // setLeftIn('');
    if (x) {
      setLeftIn(joinedIn);
      setActive('0')
    } else {
      setLeftIn('');
      setActive('1')
    };
  }

  return (
    <>
      <Helmet>
        <title>Ingressar em projeto | Mublin</title>
      </Helmet>
      <Header reloadUserInfo={true} />
      <Container size='xs' mt={20} mb={130}>
        <Center mb={10}>
          <Button.Group>
            <Button size='sm' variant='default' component='a' href='/new/project'>
              Cadastrar novo
            </Button>
            <Button size='sm' variant='filled' color='mublinColor'>
              Ingressar
            </Button>
          </Button.Group>
        </Center>
        <Title order={4} mb={14} ta='center'>
          Ingressar em um projeto
        </Title>
        <Center>
        </Center>
        <form onSubmit={formSearch.onSubmit(handleSearchChange)}>
          <Center mt={12} mb={6}>
            <Input
              w={320}
              size='lg'
              placeholder="Digite o nome do projeto..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              variant="default"
            />
            <ActionIcon 
              variant="transparent" 
              color="mublinColor" 
              size="42px" 
              ml={10}
              onClick={() => handleSearchChange()}
            >
              <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Center>
        </form>
        {searchProject.requesting ? ( 
          <Center mt={20}>
            <Loader />
          </Center>
        ) : (
          searchProject?.results[0]?.title ? (
            <Container size={'xs'}>
              <ScrollArea h={isLargeScreen ? 130 : 180} type="always" scrollbarSize={8} offsetScrollbars p={4}>
                {searchProject.results.map((project, key) => 
                  <Container key={key} p={0}>
                    <Group 
                      gap={7} 
                      py={7} 
                      onClick={
                        !userProjects.list.some(y => y.projectid === project.id) ?
                        () => handleResultSelect(project) : undefined
                      } 
                      style={!userProjects.list.some(y => y.projectid === project.id) ? {cursor: 'pointer'} : undefined}
                    >
                      <Avatar src={project.image} />
                      <Flex direction='column'>
                        {userProjects.list.some(y => y.projectid === project.id) && 
                          <Badge size='xs' color="lime" leftSection={<IconCheck style={{ width: '13px', height: '13px' }} stroke={3} />}>
                            Vinculado
                          </Badge>
                        }
                        <Text size='sm' fw={500}>
                          {project.title} {project.type && '(' + project.type + ')'}
                        </Text>
                        <Text size='11px'>{project.description}</Text>
                        <Text size='10px' c='dimmed'>Fundado em {project.foundation_year} {project.end_year && ' | Encerrado em ' + project.end_year}</Text>
                      </Flex>
                    </Group>
                    <Divider />
                  </Container>
                )}
              </ScrollArea>
            </Container>
          ) : (
            <>
              {(query && searchProject.error === "Nenhum projeto encontrado") && 
                <Text ta="center" mt={30} c='dimmed'>
                  Nenhum projeto localizado
                </Text>
              }
            </>
          )
        )}
      </Container>
      <Modal 
        fullScreen={isLargeScreen ? false : true}
        opened={modalOpen} 
        onClose={() => closeModalParticipation()} 
        title={`Ingressar em ${modalProjectTitle}?`}
        centered
        size={'md'}
      >
        <Center mb={7}>
          {/* <Avatar src={modalProjectImage} size="lg" /> */}
          <Image 
            src={modalProjectImage} 
            radius="md" 
            h={100}
            w="auto"
            fit="contain" 
          />
        </Center>
        <Text size='xs' ta='center'>{modalProjectInfo}</Text>
        <Text size='10px' ta='center' c='dimmed' mb={8} mt={4}>
          {modalProjectType && modalProjectType + ' · '} {'Projeto formado em '+modalProjectFoundationYear}{modalProjectEndYear && ' ・ Encerrada em '+modalProjectEndYear}
        </Text>
        <Divider label='Integrantes cadastrados:' mb={4} labelPosition='left' />
        {!project.requesting && 
          <Group justify='flex-start' gap={7} mb={7}>
            {members.map((member, key) => 
              <Flex key={key} direction='column' align='center'>
                <Avatar 
                  size='sm' 
                  src={avatarCDNPath+'/'+member.picture}
                  component='a'
                  href={`/${member.username}`}
                />
                <Text size='10px' mt={5} c='dimmed'>{member.name}</Text>
              </Flex>
            )}
          </Group>
        }
        <Divider mb={7} />
        <Radio.Group
          name='favoriteFramework'
          label='Qual é (ou foi) sua ligação com este projeto?'
          value={status}
          mb={10}
        >
          <Group mt="xs">
            <Radio 
              color='mublinColor' 
              value="1" 
              label="Integrante oficial"
              onChange={(event) => setStatus(event.currentTarget.value)} 
            />
            <Radio 
              color='mublinColor' 
              value="2"
              label={<Group gap={2}><IconIdBadge2 style={{ width: rem(18), height: rem(18) }} /> Contratado</Group>}
              onChange={(event) => setStatus(event.currentTarget.value)}  
            />
          </Group>
        </Radio.Group>
        <NativeSelect
          label="Sua principal função neste projeto"
          placeholder="Selecione"
          mt={16}
          mb={5}
          data={[
            { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
            { group: 'Gestão, produção e outros', items: rolesListManagement },
            { group: 'Instrumentos', items: rolesListMusicians },
          ]}
          value={mainRole}
          onChange={(e) => setMainRole(e.currentTarget.value)}
        />
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Entrei em:"
              description={'(entre ' + modalProjectFoundationYear + ' e ' + (modalProjectEndYear ? modalProjectEndYear : currentYear) + ')'}
              mb={5}
              defaultValue={modalProjectFoundationYear}
              value={joinedIn}
              onChange={(_value) => { 
                setJoinedIn(_value); 
                setLeftIn(_value);
              }}
              min={modalProjectFoundationYear} 
              max={modalProjectEndYear ? modalProjectEndYear : currentYear}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            {modalProjectEndYear ? (
              <NumberInput
                label="Deixei o projeto em:"
                description={'entre ' + joinedIn + ' e ' + modalProjectEndYear + ')'}
                mb={5}
                defaultValue={modalProjectFoundationYear}
                value={leftIn}
                onChange={(_value) => { 
                  setLeftIn(_value); 
                }}
                min={joinedIn} 
                max={modalProjectEndYear}
                disabled={checkbox ? true : false}
              />
            ) : (
              <NumberInput
                label="Deixei o projeto em"
                description={'(entre ' + joinedIn + ' e ' + currentYear + ')'}
                mb={5}
                defaultValue={modalProjectFoundationYear}
                value={leftIn}
                onChange={(_value) => { 
                  setLeftIn(_value); 
                }}
                min={joinedIn} 
                max={currentYear} 
                disabled={checkbox ? true : false}
              />
            )}
          </Grid.Col>
        </Grid>
        <Checkbox
          mt={10}
          color='mublinColor'
          label={
            modalProjectEndYear 
            ? 'Estive ativo até o final do projeto' 
            : 'Estou ativo atualmente neste projeto'
          } 
          checked={checkbox}
          onChange={() => handleCheckbox(checkbox)}
        />
        <Checkbox
          mt={8}
          color='mublinColor'
          label={'Definir como um dos meus projetos principais'} 
          checked={featured}
          onChange={() => setFeatured(value => !value)}
        />
        <Alert variant='light' color='orange' mt={16} p='xs'>
          <Text size="xs">Sua participação ficará pendente até que um dos administradores do projeto aprove a solicitação</Text>
        </Alert>
        <Group justify="flex-end" mt="md">
          <Button 
            variant='default' 
            onClick={() => closeModalParticipation()}
          >
            Fechar
          </Button>
          <Button 
            type="submit" 
            color='mublinColor'
            onClick={() => handleSubmitParticipation()}
            loading={isSubmitting}
            disabled={!joinedIn || !mainRole || !status}
          >
            Solicitar aprovação
          </Button>
        </Group>
      </Modal>
      <Modal 
        title={`Sair do projeto ${modalDeleteData.name}?`}
        opened={modalDeleteConfirmationOpen} 
        onClose={() => setModalDeleteConfirmationOpen(false)} 
        centered
        size={'sm'}
      >
        <ModalDeleteParticipationContent 
          user={user} 
          modalDeleteData={modalDeleteData} 
          adminsModalDelete={adminsModalDelete} 
          myselfAdminModalDelete={myselfAdminModalDelete} 
        />
        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={() => setModalDeleteConfirmationOpen(false)}>
            Cancelar
          </Button>
          <Button 
            color="red" 
            onClick={() => deleteProject(modalDeleteData.id)} 
            disabled={(myselfAdminModalDelete?.length === 1 && adminsModalDelete?.length === 1)}
            loading={isDeleting}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>
      <footer className='onFooter withMobileFooter'>
        {userProjects.list[0]?.id && 
          <Container size={'sm'}>
            <Splide 
              options={{
                drag: 'free',
                snap: false,
                perPage: 3,
                autoWidth: true,
                arrows: false,
                gap: '16px',
                dots: isLargeScreen ? true : false,
                pagination: isLargeScreen ? true : false,
              }}
            >
              {userProjects.list.map((project, key) =>
                <SplideSlide key={project.id}>
                <Flex gap={3} align='center' key={key}>
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
                    <Text size='10px' c="dimmed">{project.workTitle} em</Text>
                    <Text size='13px' fw={500}>{project.name}</Text>
                    <Text size='11px' c="dimmed">{project.ptname}</Text>
                    {project.confirmed === 2 && 
                      <Group gap={1} mt={3} mb={1}>
                        <IconClock style={{ width: '9px', height: '9px' }} stroke={3} /> <Text size='10px'>Aguardando aprovação</Text>
                      </Group>
                    }
                    <Anchor
                      variant="text"
                      c="red"
                      fz="11px"
                      onClick={() => handleDeleteParticipation(project)}
                    >
                      <Group gap={1}>
                        <IconX style={{ width: '9px', height: '9px' }} stroke={3} /> Sair
                      </Group>
                    </Anchor>
                  </Flex>
                </Flex>
                </SplideSlide>
              )}
            </Splide>
          </Container>
        }
      </footer>
      {(!modalDeleteConfirmationOpen && !modalOpen) &&
        <FooterMenuMobile />
      }
    </>
  );
};

export default New;