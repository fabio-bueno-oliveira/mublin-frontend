import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchInfos } from '../../../store/actions/search';
import { userInfos } from '../../../store/actions/user';
import { userProjectsInfos } from '../../../store/actions/userProjects';
import { miscInfos } from '../../../store/actions/misc';
import { projectInfos } from '../../../store/actions/project';
import { usernameCheckInfos } from '../../../store/actions/usernameCheck';
import {IKUpload} from "imagekitio-react";
import { Container, Modal, Flex, Grid, Center, Alert, ScrollArea, Title, Divider, Textarea, Text, Input, Stepper, Button, Group, TextInput, NumberInput, Checkbox, Image, NativeSelect, Radio, ThemeIcon, Avatar,  ActionIcon, Loader, Anchor, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconWorld, IconLock, IconSearch, IconX, IconIdBadge2, IconCheck, IconClock } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback  } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';
import useEmblaCarousel from 'embla-carousel-react';
import ModalDeleteParticipationContent from './modalDeleteParticipation';
import './styles.scss';

function StartFourthStep () {

  document.title = "Passo 4";

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  const currentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.user);
  const userProjects = useSelector(state => state.userProjects);
  const searchProject = useSelector(state => state.searchProject);
  const roles = useSelector(state => state.roles);
  const project = useSelector(state => state.project);
  const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);

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

  const avatarCDNPath = 'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/';
  const cdnPath = 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/';

  useEffect(() => { 
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(miscInfos.getRoles());
  }, [loggedUser.id]);

  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [modalDeleteConfirmationOpen, setModalDeleteConfirmationOpen] = useState(false);
  const [modalDeleteData, setModalDeleteData] = useState({});

  const [modalProjectInfo, setModalProjectInfo] = useState('');
  const [modalProjectTitle, setModalProjectTitle] = useState('');
  const [modalProjectImage, setModalProjectImage] = useState('');
  const [modalProjectFoundationYear, setModalFoundationYear] = useState('');
  const [modalProjectEndYear, setModalEndYear] = useState('');

  const members = project.members.filter((member) => { return member.confirmed === 1 });

  const [emblaRef1] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: true, 
      align: 'center' 
    }
  )

  // Modal para cadastro de imagem do novo projeto cadastrado
  const [modalNewProjectPictureOpen, setModalNewProjectPictureOpen] = useState(false);
  const [pictureIsLoading, SetPictureIsLoading] = useState(false);
  const [newProjectPicture, setNewProjectPicture] = useState('');

  const [query, setQuery] = useState('')
  const [lastQuery, setLastQuery] = useState('')

  const handleSearchChange = () => {
    if (query.length > 1) {
      dispatch(searchInfos.getSearchProjectResults(query))
      setLastQuery(query)
    } else {
      alert("Digite ao menos 2 caracteres!");
    }
  }

  const handleTypeChange = (value) => {
    setType(value)
    if (value === 7) {
      setUserStatus('3')
    } else {
      setUserStatus('1')
    }
  }

  const checkUsername = useDebouncedCallback(async (string) => {
    if (string.length) {
      dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
    }
  }, 800);

  // Campos do form de cadastro de projeto
  const [projectName, setProjectName] = useState('')
  const [projectUserName, setProjectUserName] = useState('')
  const [foundationYear, setFoundationYear] = useState(currentYear)
  const [checkboxProjectActive, setCheckboxProjectActive] = useState(true)
  const [endYear, setEndYear] = useState(null)
  const [bio, setBio] = useState('')
  const [type, setType] = useState('2')
  const [kind, setKind] = useState('1')
  const [npMain_role_fk, setNpMain_role_fk] = useState('')
  const [publicProject, setPublicProject] = useState('1')
  const [portfolioNewProject, setPortfolioNewProject] = useState('0')
  const [checkboxNewProjectFeatured, setCheckboxNewProjectFeatured] = useState(true)
  const [userStatus, setUserStatus] = useState('1')
  const [idNewProject, setIdNewProject] = useState('')

  const handleChangeProjectUserName = (value) => {
    setProjectUserName(value.replace(/[^A-Z0-9]/ig, "").toLowerCase())
  }

  const form = useForm({
    mode: 'uncontrolled'
  });

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

  const handleCheckboxProjectActive = (x) => {
    setCheckboxProjectActive(value => !value)
    if (x) {
        setEndYear(foundationYear)
    } else {
        setEndYear('')
    }
  }

  // Update project avatar picture filename in bd
  const updatePicture = (projectId, userId, value) => {
    SetPictureIsLoading(true)
    fetch('https://mublin.herokuapp.com/project/'+projectId+'/picture', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({userId: userId, picture: value})
    }).then((response) => {
        response.json().then((response) => {
          // console.log(response)
          SetPictureIsLoading(false)
          setNewProjectPicture(response.picture)
        })
      }).catch(err => {
        SetPictureIsLoading(false)
        console.error(err)
    })
  };

  // Image Upload to ImageKit.io
  const userAvatarPath = "/projects/"
  const [pictureFilename, setPictureFilename] = useState('')

  const onUploadError = err => {
      alert("Ocorreu um erro ao enviar a imagem. Tente novamente em alguns minutos.");
  };

  const onUploadSuccess = res => {
      let n = res.filePath.lastIndexOf('/');
      let fileName = res.filePath.substring(n + 1);
      updatePicture(idNewProject,user.id,fileName)
      setPictureFilename(fileName)
  };

  const handleResultSelect = (result) => {
    dispatch(projectInfos.getProjectMembers(result.username));
    setProjectId(result.id)
    setModalProjectInfo(result.description)
    setModalProjectTitle(result.title)
    setModalFoundationYear(result.foundation_year)
    setJoinedIn(result.foundation_year)
    setLeftIn(result.foundation_year)
    setModalEndYear(result.end_year ? result.end_year : "")
    setModalProjectImage(result.image)
    setModalOpen(true)
  }

  // Modal Delete Participation on Project
  const handleDeleteParticipation = (project) => {
    setModalDeleteData(project);
    setModalDeleteConfirmationOpen(true);
  }
  const adminsModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin);
  const myselfModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.userId === loggedUser.id)[0];
  const myselfAdminModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin && m.userId === loggedUser.id);

  const handleSubmitParticipation = () => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/add/project', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({ userId: user.id, projectId: projectId, active: active, status: status, main_role_fk: mainRole, joined_in: joinedIn, left_in: leftIn, leader: '0', featured: featured, confirmed: '2', admin: '0', portfolio: '0' })
    }).then((response) => {
      dispatch(userProjectsInfos.getUserProjects(user.id))
      setIsLoading(false)
      setModalOpen(false)
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao criar o projeto. Tente novamente em alguns minutos.")
      // setModalOpen(false)
    })
  }

  const deleteProject = (userProjectParticipationId) => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/delete/project', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({userId: loggedUser.id, userProjectParticipationId: userProjectParticipationId})
    }).then((response) => {
        // console.log(response);
        dispatch(userProjectsInfos.getUserProjects(loggedUser.id));
        setIsLoading(false);
        setModalDeleteConfirmationOpen(false);
    }).catch(err => {
        console.error(err);
        setIsLoading(false);
        alert("Ocorreu um erro ao remover o seu projeto. Tente novamente em alguns minutos.");
    })
  }

  const handleSubmitParticipationToNewProject = (newProjectUserId, newProjectProjectId, newProjectUserStatus, newProjectMain_role_fk) => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/add/project', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({ userId: newProjectUserId, projectId: newProjectProjectId, active: '1', status: newProjectUserStatus, main_role_fk: newProjectMain_role_fk, joined_in: currentYear, left_in: null, leader: '1', featured: checkboxNewProjectFeatured, confirmed: '1', admin: '1', portfolio: portfolioNewProject })
    }).then((response) => {
        dispatch(userProjectsInfos.getUserProjects(loggedUser.id))
        setIsLoading(false)
        setModalNewProjectOpen(false)
        setModalNewProjectPictureOpen(true)
    }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao te relacionar ao projeto criado. Use a busca para ingressar no projeto criado.")
        setModalNewProjectOpen(false)
    })
  }

  const handleSubmitNewProject = () => {
    setIsLoading(true);
    fetch('https://mublin.herokuapp.com/project/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({ id_user_creator_fk: loggedUser.id, projectName: projectName, projectUserName: projectUserName, foundation_year: foundationYear, end_year: endYear, bio: bio, type: type, kind: kind, public: publicProject })
    })
    .then(response => {
        return response.json();
    }).then(jsonResponse => {
        setIsLoading(false);
        setIdNewProject(jsonResponse.id)
        handleSubmitParticipationToNewProject(loggedUser.id, jsonResponse.id, userStatus, npMain_role_fk)
    }).catch (error => {
        console.error(error)
        setIsLoading(false);
        alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.")
        setModalNewProjectOpen(false)
    })
  }

  const handleFormSubmit = () => {
    setIsLoading(true)
    let user = JSON.parse(localStorage.getItem('user'));
    fetch('https://mublin.herokuapp.com/user/'+user.id+'/firstAccess', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({step: 0})
    }).then((response) => {
        response.json().then((response) => {
          dispatch(userInfos.getInfo());
          setTimeout(() => {
            navigate('/home');
          }, 400);
        })
      }).catch(err => {
        setIsLoading(false)
        console.error(err)
    })
  }

  const goToStep3 = () => {
    navigate('/start/step3');
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
        <Text ta="center" order={5} mb={11}>
          De quais projetos ou bandas você participa ou já participou?
        </Text>
        <Center>
          <Group align="baseline" gap={10}>
            <Text size="sm">Pesquise abaixo ou</Text>
            <Button 
              variant='light' 
              color='violet' 
              size="xs"
              mt={10}
              onClick={() => setModalNewProjectOpen(true)}
            >
              cadastre um projeto
            </Button>
          </Group>
        </Center>
        <form onSubmit={formSearch.onSubmit(handleSearchChange)}>
          <Center mt={12} mb={6}>
            <Input
              w={320}
              size='lg'
              placeholder="Digite o nome do projeto/banda..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              variant="default"
            />
            <ActionIcon 
              variant="transparent" 
              color="violet" 
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
              <ScrollArea h={largeScreen ? 130 : 180} type="always" scrollbarSize={8} offsetScrollbars p={4}>
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
                      <Flex direction={'column'}>
                        <Text size='sm' fw={500}>
                          {project.title} 
                          {userProjects.list.some(y => y.projectid === project.id) && 
                            <ThemeIcon size='xs' radius="xl" color="violet" ml={6}>
                              <IconCheck style={{ width: '70%', height: '70%' }} stroke={3} />
                            </ThemeIcon>
                          }
                        </Text>
                        <Text size='xs'>{project.description}</Text>
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
        fullScreen={largeScreen ? false : true}
        opened={modalNewProjectOpen} 
        onClose={() => setModalNewProjectOpen(false)} 
        title="Cadastrar novo projeto" 
        centered
        size={'md'}
      >
        <TextInput
          label="Nome do projeto"
          placeholder="Ex: Viajantes do Espaço"
          mb={5}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextInput
          label="Username do projeto"
          placeholder="Ex: viajantesdoexpaco"
          description={"mublin.com/project/"+projectUserName}
          mb={5}
          value={projectUserName}
          onChange={(e) => handleChangeProjectUserName(e.target.value)}
          onKeyUp={e => {
            checkUsername(e.target.value)
          }}
          leftSection={(projectUserName && projectUsernameAvailability.available) && <IconCheck size={20} color='green' />}
          rightSection={projectUsernameAvailability?.requesting && <Loader size={20} />}
          disabled={projectUsernameAvailability?.requesting}
          error={(projectUserName && projectUsernameAvailability.requested &&  !projectUsernameAvailability.available) && "Username indisponível "}
        />
        <NumberInput
          label="Ano de formação"
          min={1800} 
          max={currentYear}
          error={foundationYear > currentYear && "O ano deve ser inferior ao atual"}
          onChange={(_value) => setFoundationYear(_value)}
          defaultValue={currentYear}
          value={foundationYear}
        />
        <NumberInput
          label="Ano de encerramento"
          min={foundationYear} 
          max={currentYear}
          error={endYear > currentYear && "O ano deve ser inferior ao atual"}
          onChange={(_value) => setEndYear(_value)}
          defaultValue={currentYear}
          disabled={checkboxProjectActive}
          value={endYear}
        />
        <Checkbox
          my={10}
          color='violet'
          label="Em atividade"
          checked={checkboxProjectActive}
          onChange={() => handleCheckboxProjectActive(checkboxProjectActive)}
        />
        <Textarea
          label="Descrição sobre o projeto (opcional)"
          error={bio.length === "200" && "A bio atingiu o limite de 200 caracteres"}
          value={bio}
          maxLength='220'
          autosize
          minRows={2}
          maxRows={4}
          onChange={(e) => setBio(e.target.value)}
        />
        <NativeSelect
          label="Sua principal função no projeto"
          mt={6}
          data={[
            { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
            { group: 'Gestão, produção e outros', items: rolesListManagement },
            { group: 'Instrumentos', items: rolesListMusicians },
          ]}
          value={npMain_role_fk}
          onChange={(e) => setNpMain_role_fk(e.currentTarget.value)}
        />
        <NativeSelect
          mt={6}
          label="Tipo de projeto"
          value={type}
          onChange={(e) => {
            handleTypeChange(e.currentTarget.value);
          }}
        >
          <option value="">Selecione</option>
          <option value='2'>Banda</option>
          <option value='3'>Projeto</option>
          <option value='1'>Artista Solo</option>
          <option value='8'>DJ</option>
          <option value='4'>Duo</option>
          <option value='5'>Trio</option>
          <option value='7'>Ideia no papel</option>
        </NativeSelect>
        <NativeSelect
          mt={6}
          label="Conteúdo principal"
          value={kind}
          onChange={(e) => {
            setKind(e.currentTarget.value);
          }}
        >
          <option value='1'>Autoral</option>
          <option value='2'>Cover</option>
          <option value='3'>Autoral + Cover</option>
        </NativeSelect>
        <Radio.Group
          label="Visibilidade no Mublin"
          value={publicProject}
          mb={10}
          mt={6}
        >
          <Group mt="xs">
            <Radio 
              color='violet' 
              value="1" 
              label={<Group gap={2}><IconWorld style={{ width: rem(18), height: rem(18) }} /> Público</Group>} 
              onChange={() => setPublicProject('1')} 
            />
            <Radio 
              color='violet' 
              value="0"
              label={<Group gap={2}><IconLock style={{ width: rem(18), height: rem(18) }} /> Privado</Group>}  
              onChange={() => setPublicProject('0')}
            />
          </Group>
        </Radio.Group>
        <Checkbox
          my={10}
          color='violet'
          label='Definir como um dos meus projetos principais'
          checked={checkboxNewProjectFeatured}
          onChange={() => setCheckboxNewProjectFeatured(value => !value)}
        />
        <Group justify="flex-end" mt="md">
          <Button variant='default' color='violet' onClick={() => setModalNewProjectOpen(false)} >Fechar</Button>
          <Button 
            color='violet'
            onClick={handleSubmitNewProject}
            loading={isLoading}
          >
            Cadastrar
          </Button>
        </Group>
      </Modal>
      <Modal 
        fullScreen={largeScreen ? false : true}
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
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
          {'Formada em '+modalProjectFoundationYear}{modalProjectEndYear && ' ・ Encerrada em '+modalProjectEndYear}
        </Text>
        <Divider label="Integrantes cadastrados:" labelPosition="center" />
        {!project.requesting && 
          <Group justify="center" gap={7} mb={7}>
            {members.map((member, key) => 
              <Flex key={key} direction='column' align='center'>
                <Avatar 
                  size='sm' 
                  src={avatarCDNPath+member.id+'/'+member.picture}
                />
                <Text size='10px' mt={5} c='dimmed'>{member.name}</Text>
              </Flex>
            )}
          </Group>
        }
        <Divider mb={7} />
          <Radio.Group
            name="favoriteFramework"
            label="Qual é (ou foi) sua ligação com este projeto?"
            value={status}
            mb={10}
          >
            <Group mt="xs">
              <Radio 
                color='violet' 
                value="1" 
                label="Integrante oficial"
                onChange={(event) => setStatus(event.currentTarget.value)} 
              />
              <Radio 
                color='violet' 
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
            color='violet'
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
            color='violet'
            label={'Definir como um dos meus projetos principais'} 
            checked={featured}
            onChange={() => setFeatured(value => !value)}
          />
          <Alert variant="light" color="yellow" mt={16} p={'xs'}>
            <Text size="xs">Sua participação ficará pendente até que um dos administradores do projeto aprove sua solicitação</Text>
          </Alert>
          <Group justify="flex-end" mt="md">
            <Button 
              variant='default' 
              onClick={() => setModalOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              type="submit" 
              color='violet'
              onClick={() => handleSubmitParticipation()}
              loading={isLoading}
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
            loading={isLoading}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>
      <Modal 
        title={`Definir foto para ${projectName}?`}
        opened={modalNewProjectPictureOpen} 
        onClose={() => setModalNewProjectPictureOpen(false)} 
        centered
        size={'sm'}
      >
        {!newProjectPicture ? (
          <>
            {/* <Image centered rounded src='https://ik.imagekit.io/mublin/tr:h-200,w-200/sample-folder/avatar-undefined_-dv9U6dcv3.jpg' size='small' className="mb-3" /> */}
          </>
        ) : (
          <Center>
            <Image 
              src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/projects/'+newProjectPicture} 
              radius="md" 
              h={100}
              w="auto"
              fit="contain" 
            />
          </Center>
        )}
        <Center>
          <div className="customFileUpload">
            <IKUpload 
              fileName={projectUserName+'_avatar.jpg'}
              folder={userAvatarPath}
              tags={["avatar"]}
              useUniqueFileName={true}
              isPrivateFile= {false}
              onError={onUploadError}
              onSuccess={onUploadSuccess}
            />
          </div>
        </Center>
        {pictureIsLoading &&
          <Center>
            <Loader />
          </Center>
        }
        <Group mt="sm" justify="flex-end">
          {!pictureFilename && 
            <Button variant="default" onClick={() => setModalNewProjectPictureOpen(false)}>
              Enviar depois
            </Button>
          }
          {pictureFilename && 
            <Button 
              color='violet'
              onClick={() => { 
                dispatch(userProjectsInfos.getUserProjects(user.id));
                setModalNewProjectPictureOpen(false);
              }}
            >
              Concluir
            </Button>
          }
        </Group>
      </Modal>
      <footer className='onFooter step4Page'>
        {userProjects.list[0].id && 
          <Container size={'sm'} className="embla projects" ref={emblaRef1}>
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
              )}
            </div>
          </Container>
        }
        <Group justify="center" mt="lg">
          <Button variant='default' size='lg' onClick={() => goToStep3()}>Voltar</Button>
          <Button color='violet' size='lg' onClick={handleFormSubmit} loading={isLoading}>
            Concluir
          </Button>
        </Group>
        {/* <Text size="xs" mt={10}>Você poderá ingressar ou criar projetos mais tarde se preferir</Text> */}
      </footer>
    </>
  );
};

export default StartFourthStep;