import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { miscInfos } from '../../store/actions/misc';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { searchInfos } from '../../store/actions/search';
import { Container, Flex, Grid, Modal, Paper, Center, Box, ScrollArea, Avatar, Text, Anchor, Checkbox, Group, Image, NumberInput, TextInput, Input, Textarea, NativeSelect, Radio, Title, Button, Loader, Badge, Divider } from '@mantine/core';
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { useDebouncedCallback  } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import {IKUpload} from "imagekitio-react";
import { IconTrash, IconCheck, IconSearch } from '@tabler/icons-react';

function New () {

  const dispatch = useDispatch();

  document.title = 'Criar novo projeto | Mublin'

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);
  const roles = useSelector(state => state.roles);
  const searchProjects = useSelector(state => state.search);

  let navigate = useNavigate();

  useEffect(() => { 
    dispatch(searchInfos.resetSearchProjectResults());
    dispatch(miscInfos.getRoles());
  }, [userInfo.id]);

  const checkUsername = useDebouncedCallback(async (string) => {
    if (string.length) {
      dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
    }
  }, 800);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();
  const [projectImage, setProjectImage] = useState('');
  const [projectUsernameFinal, setProjectUsernameFinal] = useState('');

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

  useEffect(() => {
    if (searchProjects.projects.total > 0) {
      // setSimilarProjectAlert(true);
      notifications.show({
        id: 'similar',
        autoClose: 5000,
        position: "top-right",
        withBorder: true,
        color: "yellow",
        title: 'Encontramos projetos com nomes parecidos',
        message: <>
          <Text size="xs" c="dimmed">Será que seu projeto já está cadastrado?</Text>
        </>,
      })
    }
  }, [searchProjects.projects.total]);

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

  // Image upload to imagekit.io
  const projectImagePath = "/projects/"
  const onUploadError = err => {
      alert("Ocorreu um erro ao enviar a imagem do projeto. Tente novamente em alguns minutos.");
  };
  const onUploadSuccess = res => {
      let n = res.filePath.lastIndexOf('/');
      let fileName = res.filePath.substring(n + 1);
      setProjectImage(fileName);
  };

  const removeImage = () => {
    setProjectImage('');
    document.querySelector('#projectImage').value = null;
  }

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
      setIsSubmitting(false);
      console.error(error);
      alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.");
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
        dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
        setIsSubmitting(false)
        navigate({
          // pathname: '/projects/'+projectUsernameFinal,
          pathname: '/home',
          search: createSearchParams({
            new: 'true'
          }).toString()
        });
    }).catch(err => {
      setIsSubmitting(false)
      console.error(err)
      alert("Ocorreu um erro ao criar o projeto. Tente novamente em instantes.")
    })
  }

  return (
    <>
      <Header />
      <Container size='xs' mt={20} mb={130}>
        <Center mb={10}>
          <Button.Group>
            <Button size='sm' variant="filled" color='mublinColor'>
              Cadastrar novo
            </Button>
            <Button size='sm' variant="default" component='a' href='/new/join'>
              Ingressar
            </Button>
          </Button.Group>
        </Center>
        <Title order={3} mb={14} ta='center'>
          Cadastrar novo projeto
        </Title>
        <form 
          onSubmit={form.onSubmit(handleSubmitNewProject)}
        >
          <TextInput
            withAsterisk
            label='Nome do projeto'
            placeholder='Ex: Viajantes do Espaço'
            key={form.key('projectName')}
            {...form.getInputProps('projectName')}
          />
          <Checkbox
            mt={8}
            color='mublinColor'
            label='Definir como um dos meus projetos principais'
            key={form.key('featured')}
            {...form.getInputProps('featured', { type: 'checkbox' })}
          />
          {!!searchProjects.projects.total && 
            <Paper shadow='xs' withBorder p='sm' mt={8} mb={14}>
              <Text size='xs' fw={500}>Encontramos projetos com nomes parecidos</Text>
              <Text size='xs' c='dimmed'>Será que seu projeto já está cadastrado?</Text>
              <ScrollArea 
                w='100%' 
                h={60} 
                type='always' 
                scrollbarSize={10} 
                scrollHideDelay={500}
              >
                <Flex direction='row' gap={14} w='max-content'>
                  {searchProjects.projects.result.map((project, key) => 
                    <Group key={key} gap={3} mt={6}>
                      <Anchor href={`/project/${project?.username}`}>
                        <Avatar size='md' src={project.picture ? project.picture : undefined} />
                      </Anchor>
                      <Flex direction='column'>
                        <Text size='xs' fw={500}>{project.name} ({project.type}{project.mainGenre ? ' • ' + project.mainGenre : null})</Text>
                        <Text size='11px' c='dimmed'>{project.city ? project.city : null}{project.region ? ', ' + project.region : null}{project.country ? ', ' + project.country : null}</Text>
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
            label='Username do projeto'
            placeholder='Ex: viajantesdoexpaco'
            description={
              'mublin.com/project/'+projectUsernameFinal
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
            <Badge size='xs' color='red'>Nome de usuário do projeto não disponível</Badge>
          }
          <Divider mt='xs' mb='sm' label='Imagem' labelPosition='center' />
          <Flex direction='column'>
            {/* <Input.Label>Foto</Input.Label> */}
            <div style={projectImage ? {display: 'none'} : undefined}>
              <IKUpload 
                id='projectImage'
                fileName={projectUsernameFinal+'_.jpg'}
                folder={projectImagePath}
                tags={['project', 'avatar']}
                useUniqueFileName={true}
                isPrivateFile= {false}
                onError={onUploadError}
                onSuccess={onUploadSuccess}
                accept='image/x-png,image/gif,image/jpeg' 
              />
            </div>
          </Flex>
          {projectImage && 
            <Flex gap={10}>
              <Image 
                radius='md'
                h='auto'
                w={130}
                // fit='fill'
                src={'https://ik.imagekit.io/mublin/tr:w-130/projects/'+projectImage} 
              /> 
              <Button 
                size='xs' 
                color='red' 
                onClick={() => removeImage()}
                leftSection={<IconTrash size={14} />}
              >
                Remover
              </Button>
            </Flex>
          }
          <Divider mb='xs' mt='sm' label='Informações adicionais' labelPosition='center' />
          <Grid mt={8}>
            <Grid.Col span={6}>
              <NativeSelect
                withAsterisk
                label='Tipo de projeto'
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
      </Container>
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
      <FooterMenuMobile />
    </>
  );
};

export default New;