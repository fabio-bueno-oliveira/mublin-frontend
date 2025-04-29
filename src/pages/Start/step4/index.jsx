import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchInfos } from '../../../store/actions/search';
import { userActions } from '../../../store/actions/user';
import { userProjectsInfos } from '../../../store/actions/userProjects';
import { miscInfos } from '../../../store/actions/misc';
import { projectInfos } from '../../../store/actions/project';
import { usernameCheckInfos } from '../../../store/actions/usernameCheck';
import {IKUpload} from "imagekitio-react";
import { Container, Box, Paper, Modal, Flex, Grid, Center, Alert, ScrollArea, Title, Divider, Textarea, Text, Input, Stepper, Button, Group, TextInput, NumberInput, Checkbox, Image, NativeSelect, Radio, ThemeIcon, Avatar,  ActionIcon, Loader, Anchor, Badge, rem } from '@mantine/core';
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { IconArrowLeft, IconSearch, IconX, IconIdBadge2, IconCheck, IconClock, IconTrash, IconCamera } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback  } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';
import ModalDeleteParticipationContent from './modalDeleteParticipation';
import './styles.scss';

function StartFourthStep () {

  document.title = "Passo 4";

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const largeScreen = useMediaQuery('(min-width: 60em)');

  const currentYear = new Date().getFullYear();

  const [projectImage, setProjectImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useSelector(state => state.user);
  const userProjects = useSelector(state => state.userProjects);
  const searchProject = useSelector(state => state.searchProject);
  const searchProjects = useSelector(state => state.search);
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
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
    dispatch(miscInfos.getRoles());
  }, [loggedUserId]);

  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const closeModalParticipation = () => {
    setModalOpen(false);
    setMainRole('');
  }

  const [modalDeleteConfirmationOpen, setModalDeleteConfirmationOpen] = useState(false);
  const [modalDeleteData, setModalDeleteData] = useState({});

  const [modalProjectInfo, setModalProjectInfo] = useState('');
  const [modalProjectTitle, setModalProjectTitle] = useState('');
  const [modalProjectType, setModalProjectType] = useState('');
  const [modalProjectImage, setModalProjectImage] = useState('');
  const [modalProjectFoundationYear, setModalFoundationYear] = useState('');
  const [modalProjectEndYear, setModalEndYear] = useState('');

  const members = project.members.filter((member) => { return member.confirmed === 1 });

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

  const [formValues, setFormValues] = useState({
    projectName: '',
    foundation_year: '',
    end_year: '',
    bio: '',
    npMain_role_fk: '',
    type: '',
    activity_status: '',
    id_region_fk: '',
    id_city_fk: '',
    cityName: ''
  })

  const checkUsername = useDebouncedCallback(async (string) => {
    if (string.length) {
      dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
    }
  }, 800);

  const checkProjectName = useDebouncedCallback(async (string) => {
    if (string.length) {
      dispatch(searchInfos.getSearchProjectsResults(string));
    }
  }, 800);

  useEffect(() => {
    if (formValues.projectName.length > 3) {
      checkProjectName(formValues.projectName);
    }
  }, [formValues.projectName]);

  const [projectUsernameFinal, setProjectUsernameFinal] = useState('');

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      projectName: '',
      projectUserName: '',
      foundation_year: currentYear,
      end_year: null,
      bio: '',
      npMain_role_fk: '',
      type: '2',
      kind: '1',
      activity_status: '1',
      publicProject: '1',
      featured: false,
      id_country_fk: '27',
      id_region_fk: ''
    },

    onValuesChange: (values) => {
      let usernameFormatted = values.projectUserName.replace(/[^A-Z0-9]/ig, "").toLowerCase();
      form.setFieldValue("projectUserName", usernameFormatted);
      setFormValues({
        ...formValues,
        projectName: values.projectName,
        foundation_year: values.foundation_year,
        end_year: values.end_year,
        bio: values.bio,
        npMain_role_fk: values.npMain_role_fk,
        type: values.type,
        activity_status: values.activity_status,
        id_region_fk: values.id_region_fk
      })
      if (usernameFormatted !== projectUsernameFinal && usernameFormatted.length > 1) {
        setProjectUsernameFinal(usernameFormatted);
        checkUsername(values.projectUserName);
      }
      if (values.activity_status !== "2") {
        form.setFieldValue("end_year", "");
      }
    },

    validate: {
      projectName: (value) => (value.length < 2 ? 'O nome do projeto deve ter no mínimo 2 letras' : null),
      projectUserName: (value) => (value.length < 2 ? 'O username do projeto deve ter no mínimo 2 letras' : null),
      foundation_year: isInRange({ min: 1800, max: currentYear }, 'O ano de fundação deve ser entre 1800 e o ano atual'),
      end_year: (value, values) => ((!value && values.activity_status === "2") ? 'Informe o ano de encerramento do projeto' : null),
      npMain_role_fk: isNotEmpty('Informe sua principal atividade neste projeto'),
      type: isNotEmpty('Informe o tipo do projeto'),
      kind: isNotEmpty('Informe o conteúdo do projeto'),
      activity_status: isNotEmpty('Informe o status do projeto'),
      id_country_fk: isNotEmpty('Informe o País de origem do projeto'),
      id_region_fk: isNotEmpty('Informe o Estado de origem do projeto'),
    },
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

  // Image upload to imagekit.io
  const [uploading, setUploading] = useState(false)
  const [fileId, setFileId] = useState('')
  const projectImagePath = "/projects/"
  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setUploading(true)
  };
  const onUploadError = err => {
      alert("Ocorreu um erro ao enviar a imagem do projeto. Tente novamente em alguns minutos.");
  };
  const onUploadSuccess = res => {
      let n = res.filePath.lastIndexOf('/');
      let fileName = res.filePath.substring(n + 1);
      setFileId(res.fileId);
      setProjectImage(fileName);
      setUploading(false);
  };

  const handleRemoveImageFromServer = async (fileId) => {
    const url = 'https://api.imagekit.io/v1/files/'+fileId;
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
      }
    };

    try {
      await fetch(url, options);
    } catch (error) {
      console.error(error);
    }
  }
  const removeImage = () => {
    handleRemoveImageFromServer(fileId)
    setProjectImage('');
    document.querySelector('#projectImage').value = null;
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
  const handleDeleteParticipation = (project) => {
    setModalDeleteData(project);
    setModalDeleteConfirmationOpen(true);
  }
  const adminsModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin);
  const myselfModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.userId === loggedUserId)[0];
  const myselfAdminModalDelete = userProjects.members.filter(m => m.projectId === modalDeleteData.projectid && m.admin && m.userId === loggedUserId);

  const selectCityOnModalList = (cityId, cityName) => {
    setFormValues({...formValues, id_city_fk: cityId, cityName: cityName});
    setModalCityOpen(false);
  }

  const searchCity = useDebouncedCallback(async (query) => {
    if (query?.length > 1) {
      setCitySearchIsLoading(true);
      setNoCitySearchResults(false);
      fetch('https://mublin.herokuapp.com/search/cities/'+query+'/'+formValues.id_region_fk, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(
          (result) => {
            if (result?.length) {
              setQueryCities(
                result.map(e => { return { value: String(e.value), label: e.text }})
              );
              setNoCitySearchResults(false)
            } else {
              setNoCitySearchResults(true);
            }
            setCitySearchIsLoading(false);
          },
          (error) => {
            console.log(error)
            setCitySearchIsLoading(false);
            setNoCitySearchResults(true);
            alert("Ocorreu um erro ao tentar pesquisar a cidade");
        })
      }
  },500);

  // City search
  const [modalCityOpen, setModalCityOpen] = useState(false);
  const [queryCities, setQueryCities] = useState([]);
  const [citySearchIsLoading, setCitySearchIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [noCitySearchResults, setNoCitySearchResults] = useState(false);
  const handleSearchCity = (e, value) => {
    e.preventDefault();
    searchCity(value);
    setNoCitySearchResults(false);
  }

  const handleSubmitParticipation = () => {
    setIsSubmitting(true)
    fetch('https://mublin.herokuapp.com/user/add/project', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ userId: loggedUserId, projectId: projectId, active: active, status: status, main_role_fk: mainRole, joined_in: joinedIn, left_in: leftIn ? leftIn : null, leader: '0', featured: featured, confirmed: '2', admin: '0', portfolio: '0' })
    }).then((response) => {
      dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
      setMainRole('')
      setIsSubmitting(false)
      closeModalParticipation()
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao criar o projeto. Tente novamente em alguns minutos.")
      // closeModalParticipation()
    })
  }

  const deleteProject = (userProjectParticipationId) => {
    setIsDeleting(true)
    fetch('https://mublin.herokuapp.com/user/delete/project', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({userId: loggedUserId, userProjectParticipationId: userProjectParticipationId})
    }).then((response) => {
        // console.log(response);
        dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
        setIsDeleting(false);
        setModalDeleteConfirmationOpen(false);
    }).catch(err => {
        console.error(err);
        setIsDeleting(false);
        alert("Ocorreu um erro ao remover o seu projeto. Tente novamente em alguns minutos.");
    })
  }

  const handleSubmitParticipationToNewProject = (newProjectUserId, newProjectProjectId, newProjectType, newProjectMain_role_fk, featured) => {
    setIsSubmitting(true)
    fetch('https://mublin.herokuapp.com/user/add/project', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ userId: newProjectUserId, projectId: newProjectProjectId, active: '1', status: newProjectType === 7 ? 3 : 1, main_role_fk: newProjectMain_role_fk, joined_in: currentYear, left_in: null, leader: '1', featured: featured, confirmed: '1', admin: '1', portfolio: '0' })
    }).then((response) => {
        dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
        setIsSubmitting(false)
        setModalNewProjectOpen(false)
    }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao te relacionar ao projeto criado. Use a busca para ingressar no projeto criado.")
        setModalNewProjectOpen(false)
    })
  }

  const handleSubmitNewProject = (values) => {
    setIsSubmitting(true);
    fetch('https://mublin.herokuapp.com/project/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_user_creator_fk: loggedUserId, projectName: values.projectName, projectUserName: values.projectUserName, projectImage: projectImage, foundation_year: values.foundation_year, end_year: values.end_year ? values.end_year : null, bio: values.bio, type: values.type, kind: values.kind, activity_status: values.activity_status, public: values.publicProject, id_country_fk: values.id_country_fk, id_region_fk: values.id_region_fk, id_city_fk: formValues.id_city_fk })
    })
    .then(response => {
        return response.json();
    }).then(jsonResponse => {
      setIsSubmitting(true);
      handleSubmitParticipationToNewProject(
        loggedUserId, jsonResponse.id, formValues.type, formValues.npMain_role_fk, values.featured
      );
    }).catch (error => {
      console.error(error);
      setIsSubmitting(false);
      alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.");
      setModalNewProjectOpen(false);
    })
  }

  const handleFormSubmit = () => {
    setIsSubmitting(true)
    let user = JSON.parse(localStorage.getItem('user'));
    fetch('https://mublin.herokuapp.com/user/'+loggedUserId+'/firstAccess', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({step: 0})
    }).then((response) => {
        response.json().then((response) => {
          dispatch(userActions.getInfo());
          setTimeout(() => {
            navigate('/home');
          }, 400);
        })
      }).catch(err => {
        setIsSubmitting(false)
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
        <Stepper color='mublinColor' active={3} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
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
              color='mublinColor' 
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
                          {project.title} {project.type && '(' + project.type + ')'} 
                          {userProjects.list.some(y => y.projectid === project.id) && 
                            <ThemeIcon size='xs' radius="xl" color="mublinColor" ml={6}>
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
        <form 
          onSubmit={form.onSubmit(handleSubmitNewProject)}
        >
          <TextInput
            withAsterisk
            label="Nome do projeto"
            placeholder="Ex: Viajantes do Espaço"
            key={form.key('projectName')}
            {...form.getInputProps('projectName')}
          />
          <Checkbox
            mt={8}
            color="mublinColor"
            label="Definir como um dos meus projetos principais"
            key={form.key('featured')}
            {...form.getInputProps('featured', { type: 'checkbox' })}
          />
          {!!searchProjects.projects.total && 
            <Paper shadow="xs" withBorder p="sm" mt={8} mb={14}>
              <Text size="xs" fw={500}>Encontramos projetos com nomes parecidos</Text>
              <Text size="xs" c="dimmed">Será que seu projeto já está cadastrado?</Text>
              <ScrollArea 
                w="100%" 
                h={60} 
                type="always" 
                scrollbarSize={10} 
                scrollHideDelay={500}
              >
                <Flex direction="row" gap={14} w="max-content">
                  {searchProjects.projects.result.map((project, key) => 
                    <Group key={key} gap={3} mt={6}>
                      <Avatar size="md" src={project.picture ? project.picture : undefined} />
                      <Flex direction="column">
                        <Text size="xs" fw={500}>{project.name} ({project.type}{project.mainGenre ? " • " + project.mainGenre : null})</Text>
                        <Text size="11px" c="dimmed">{project.city ? project.city : null}{project.region ? ", " + project.region : null}{project.country ? ", " + project.country : null}</Text>
                      </Flex>
                    </Group>
                  )}
                </Flex>
              </ScrollArea>
            </Paper>
          }
          <TextInput
            mt={8}
            withAsterisk
            label="URL do projeto"
            placeholder="Ex: viajantesdoexpaco"
            description={
              "mublin.com/project/"+projectUsernameFinal
            }
            leftSection={
              (
                projectUsernameFinal && 
                projectUsernameAvailability.available && 
                !projectUsernameAvailability?.requesting
              ) && 
                <IconCheck size={20} color='green' />
            }
            rightSection={projectUsernameAvailability?.requesting && <Loader size={20} />}
            maxLength={70}
            disabled={projectUsernameAvailability?.requesting}
            key={form.key('projectUserName')}
            {...form.getInputProps('projectUserName')}
          />
          {(projectUsernameFinal && projectUsernameAvailability.requested && projectUsernameAvailability.available === false) && 
            <Badge size="xs" color="red">Nome de usuário do projeto não disponível</Badge>
          }
          <Divider mt="xs" mb="sm" label="Imagem" labelPosition="center" />
          <Flex direction="column">
            {/* <Input.Label>Foto</Input.Label> */}
            <div className='customFileUpload' style={projectImage ? {display: 'none'} : undefined}>
              <IKUpload 
                id='projectImage'
                fileName={projectUsernameFinal+"_.jpg"}
                folder={projectImagePath}
                tags={["project", "avatar"]}
                name='file-input'
                className='file-input__input'
                useUniqueFileName={true}
                isPrivateFile= {false}
                onError={onUploadError}
                onUploadStart={onUploadStart}
                onSuccess={onUploadSuccess}
                accept="image/x-png,image/gif,image/jpeg" 
              />
              <Button
                component='label'
                htmlFor='projectImage'
                leftSection={<IconCamera size={14} />}
                color='mublinColor'
                size='sm'
              >
                {uploading ? 'Enviando...' : 'Inserir imagem'}
              </Button>
            </div>
          </Flex>
          {projectImage && 
            <Flex gap={10}>
              <Image 
                radius="md"
                h="auto"
                w={130}
                // fit="fill"
                src={'https://ik.imagekit.io/mublin/tr:w-130/projects/'+projectImage} 
              /> 
              <Button 
                size="xs" 
                color="red" 
                onClick={() => removeImage()}
                leftSection={<IconTrash size={14} />}
              >
                Remover
              </Button>
            </Flex>
          }
          <Divider mb="xs" mt="sm" label="Informações adicionais" labelPosition="center" />
          <Grid mt={8}>
            <Grid.Col span={6}>
              <NativeSelect
                withAsterisk
                label="Tipo de projeto"
                key={form.key('type')}
                {...form.getInputProps('type')}
              >
                <option value='2'>Banda</option>
                <option value='3'>Projeto</option>
                <option value='1'>Artista Solo</option>
                <option value='8'>DJ</option>
                <option value='4'>Dupla</option>
                <option value='5'>Trio</option>
                <option value='9'>Grupo</option>
              </NativeSelect>
            </Grid.Col>
            <Grid.Col span={6}>
              <NativeSelect
                withAsterisk
                label="Conteúdo principal"
                key={form.key('kind')}
                {...form.getInputProps('kind')}
              >
                <option value='1'>Autoral</option>
                <option value='2'>Cover</option>
                <option value='3'>Autoral + Cover</option>
              </NativeSelect>
            </Grid.Col>
          </Grid>
          <NativeSelect
            withAsterisk
            label="Status do projeto"
            mt={6}
            key={form.key('activity_status')}
            {...form.getInputProps('activity_status')}
          >
            <option value=''>Selecione</option>
            <option value='1'>Projeto em atividade</option>
            <option value='2'>Projeto encerrado</option>
            <option value='3'>Projeto ativo vez em quando</option>
            <option value='4'>Projeto sazonal / de temporada</option>
            <option value='5'>Projeto ainda em construção</option>
            <option value='6'>Projeto em Hiato/Parado</option>
          </NativeSelect>
          <Grid mt={8}>
            <Grid.Col span={6}>
              <NumberInput
                withAsterisk
                label="Ano de formação"
                min={1800} 
                max={formValues.end_year ? formValues.end_year : currentYear}
                key={form.key('foundation_year')}
                {...form.getInputProps('foundation_year')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                withAsterisk={formValues.activity_status === "2"}
                label="Ano de encerramento"
                min={formValues.foundation_year} 
                max={currentYear}
                disabled={formValues.activity_status !== "2"}
                key={form.key('end_year')}
                {...form.getInputProps('end_year')}
              />
            </Grid.Col>
          </Grid>
          <Grid mt={2}>
            <Grid.Col span={6}>
              <NativeSelect
                label="País de origem"
                key={form.key('id_country_fk')}
                {...form.getInputProps('id_country_fk')}
              >
                <option value="">Selecione</option>
                <option value='27'>Brasil</option>
              </NativeSelect>
            </Grid.Col>
            <Grid.Col span={6}>
              <NativeSelect
                label="Estado"
                key={form.key('id_region_fk')}
                {...form.getInputProps('id_region_fk')}
              >
                <option value="">Selecione</option>
                <option value="415">Acre</option>
                <option value="422">Alagoas</option>
                <option value="406">Amapa</option>
                <option value="407">Amazonas</option>
                <option value="402">Bahia</option>
                <option value="409">Ceara</option>
                <option value="424">Distrito Federal</option>
                <option value="401">Espirito Santo</option>
                <option value="411">Goias</option>
                <option value="419">Maranhao</option>
                <option value="418">Mato Grosso</option>
                <option value="399">Mato Grosso do Sul</option>
                <option value="404">Minas Gerais</option>
                <option value="408">Para</option>
                <option value="405">Paraiba</option>
                <option value="413">Parana</option>
                <option value="417">Pernambuco</option>
                <option value="416">Piaui</option>
                <option value="410">Rio de Janeiro</option>
                <option value="414">Rio Grande do Norte</option>
                <option value="400">Rio Grande do Sul</option>
                <option value="403">Rondonia</option>
                <option value="421">Roraima</option>
                <option value="398">Santa Catarina</option>
                <option value="412">São Paulo</option>
                <option value="423">Sergipe</option>
                <option value="420">Tocantins</option>
              </NativeSelect>
            </Grid.Col>
          </Grid>
          {formValues.id_city_fk ? ( 
            <Input.Wrapper 
              label={
                <Group gap={2} mt={8}>
                  Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />}
                </Group>
              }
            >
              <Input 
                size="sm" 
                pointer
                onClick={() => setModalCityOpen(true)}
                value={formValues.cityName}
              />
            </Input.Wrapper>
          ) : (
            <Input.Wrapper 
              label={
                <Group gap={2} mt={8}>
                  Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />}
                </Group>
              }
            >
              <Input 
                value={formValues.id_region_fk ? "Selecione..." : "Selecione o Estado antes"}
                size="sm"
                pointer
                rightSection={formValues.id_region_fk ? <IconSearch size={16} /> : undefined}
                onClick={() => setModalCityOpen(true)}
                disabled={!formValues.id_region_fk}
              />
            </Input.Wrapper>
          )}
          <Textarea
            mt={8}
            label="Bio"
            description={formValues.bio.length+'/220'}
            placeholder="Conte um pouco sobre o projeto (opcional)"
            maxLength="220"
            key={form.key('bio')}
            {...form.getInputProps('bio', { type: 'checkbox' })}
          />
          <NativeSelect
            withAsterisk
            label="Sua principal função no projeto"
            description="Você também será atribuído automaticamente como Administrador deste novo projeto"
            mt={6}
            data={[
              { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
              { group: 'Gestão, produção e outros', items: rolesListManagement },
              { group: 'Instrumentos', items: rolesListMusicians },
            ]}
            key={form.key('npMain_role_fk')}
            {...form.getInputProps('npMain_role_fk')}
          />
          <Radio.Group
            mt={8}
            name="favoriteFramework"
            label="Visibilidade"
            description="Exibir o projeto nas buscas do Mublin e mecanismos externos?"
            key={form.key('publicProject')}
            {...form.getInputProps('publicProject')}
          >
            <Group mt="xs">
              <Radio color="mublinColor" value="1" label="Público" />
              <Radio color="mublinColor" value="0" label="Privado" />
            </Group>
          </Radio.Group>
          <Group justify="flex-end" mt="md">
            <Button 
              size="md"
              type="submit"
              color="mublinColor"
              loading={isSubmitting}
              disabled={(projectUsernameFinal && projectUsernameAvailability.requested && projectUsernameAvailability.available === false)}
            >
              Cadastrar
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal 
        fullScreen={largeScreen ? false : true}
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
          {modalProjectType && modalProjectType + ' · '} {'Formada em '+modalProjectFoundationYear}{modalProjectEndYear && ' ・ Encerrada em '+modalProjectEndYear}
        </Text>
        <Divider label="Integrantes cadastrados:" labelPosition="left" />
        {!project.requesting && 
          <Group justify="flex-start" gap={7} mb={7}>
            {members.map((member, key) => 
              <Flex key={key} direction='column' align='center'>
                <Avatar 
                  size='sm' 
                  src={avatarCDNPath+'/'+member.picture}
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
        <Alert variant="light" color="yellow" mt={16} p={'xs'}>
          <Text size="xs">Sua participação ficará pendente até que um dos administradores do projeto aprove sua solicitação</Text>
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
      <footer className='onFooter step4Page'>
        {userProjects.list[0]?.id && 
          <Container size={'sm'}>
            <Flex gap='17'>
              {userProjects.list.map((project, key) =>
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
                    <Text size='13px' fw={500}>{project.name}</Text>
                    <Text size='11px' c="dimmed">{project.ptname}</Text>
                    <Text size='10px' c="dimmed">{project.workTitle}</Text>
                    {project.loggedUserIsConfirmed === 2 && 
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
            </Flex>
          </Container>
        }
        <Group justify="center" mt="lg">
          <Button 
            variant='default'
            size='lg'
            leftSection={<IconArrowLeft size={14} />}
            onClick={() => goToStep3()}
          >
            Voltar
          </Button>
          <Button color='mublinColor' size='lg' onClick={handleFormSubmit} loading={isSubmitting}>
            Concluir
          </Button>
        </Group>
        {/* <Text size="xs" mt={10}>Você poderá ingressar ou criar projetos mais tarde se preferir</Text> */}
        <Modal
          title='Selecionar cidade'
          opened={modalCityOpen}
          onClose={() => setModalCityOpen(false)}
          size={'sm'}
        >
          <Grid>
            <Grid.Col span={7}>
              <form onSubmit={(e) => handleSearchCity(e, searchValue)}>
                <TextInput
                  placeholder="Digite e selecione..."
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  mb={5}
                  data-autofocus
                />
              </form>
            </Grid.Col>
            <Grid.Col span={5}>
              <Button color="mublinColor" onClick={() => searchCity(searchValue)}>
                Pesquisar
              </Button>
            </Grid.Col>
          </Grid>
          {citySearchIsLoading && 
            <Center my={20}>
              <Loader color="mublinColor" size="sm" type="bars" />
            </Center>
          }
          {!!(queryCities.length && !citySearchIsLoading) && 
            <>
              <Text size='xs' c='dimmed' mt={10} mb={10}>
                {queryCities.length} {queryCities.length === 1 ? "cidade localizada" : "cidades localizadas"} 
              </Text>
              <ScrollArea h={170} type="always" offsetScrollbars>
                {queryCities.map((city, key) =>
                  <Box key={key} py={3}>
                    <Anchor 
                      size='lg' 
                      my={10} 
                      onClick={() => selectCityOnModalList(city.value, city.label)}
                    >
                      {city.label}
                    </Anchor>
                    <Divider />
                  </Box>
                )}
              </ScrollArea>
            </>
          }
          {noCitySearchResults &&
            <Text size='xs' c='dimmed' mt={10} mb={10}>
              Nenhuma cidade localizada a partir desta pesquisa no Estado escolhido
            </Text>
          }
        </Modal>
      </footer>
    </>
  );
};

export default StartFourthStep;