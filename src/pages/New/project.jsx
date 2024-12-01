import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { miscInfos } from '../../store/actions/misc';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { Container, Flex, Grid, Checkbox, Group, Image, NumberInput, TextInput, Input, Textarea, NativeSelect, Radio, Title, Text, Button, Loader, Badge } from '@mantine/core';
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { useDebouncedCallback  } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import {IKUpload} from "imagekitio-react";
import { IconTrash, IconCheck } from '@tabler/icons-react';

function New () {

  const dispatch = useDispatch();

  document.title = 'Criar novo projeto | Mublin'

  let loggedUser = JSON.parse(localStorage.getItem('user'));

  const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);
  const roles = useSelector(state => state.roles);

  useEffect(() => { 
    dispatch(miscInfos.getRoles());
  }, [loggedUser.id]);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();
  const [projectImage, setProjectImage] = useState('');
  const [projectUsernameFinal, setProjectUsernameFinal] = useState('');

  const [formValues, setFormValues] = useState({
    foundation_year: '',
    projectIsActive: true,
    bio: '',
    npMain_role_fk: ''
  })

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      projectName: '',
      projectUserName: '',
      foundation_year: currentYear,
      end_year: '',
      projectIsActive: true,
      bio: '',
      npMain_role_fk: '',
      type: '2',
      kind: '1',
      publicProject: "1"
    },

    onValuesChange: (values) => {
      let usernameFormatted = values.projectUserName.replace(/[^A-Z0-9]/ig, "").toLowerCase();
      form.setFieldValue("projectUserName", usernameFormatted);
      setFormValues({
        ...formValues, 
        foundation_year: values.foundation_year,
        projectIsActive: values.projectIsActive,
        bio: values.bio,
        npMain_role_fk: values.npMain_role_fk
      })
      if (usernameFormatted !== projectUsernameFinal && usernameFormatted.length > 1) {
        setProjectUsernameFinal(usernameFormatted);
        checkUsername(values.projectUserName);
      }
    },

    validate: {
      projectName: (value) => (value.length < 2 ? 'O nome do projeto deve ter no mínimo 2 letras' : null),
      projectUserName: (value) => (value.length < 2 ? 'O username do projeto deve ter no mínimo 2 letras' : null),
      foundation_year: isInRange({ min: 1800, max: currentYear }, 'O ano de fundação deve ser entre 1800 e o ano atual'),
      end_year: (value) => ((!value && !formValues.projectIsActive) ? 'Informe o ano de encerramento do projeto' : null),
      npMain_role_fk: isNotEmpty('Informe sua principal atividade neste projeto'),
      type: isNotEmpty('Informe o tipo do projeto'),
      kind: isNotEmpty('Informe o conteúdo do projeto'),
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
      setProjectImage(fileName)
  };

  const removeImage = () => {
    setProjectImage('');
    document.querySelector('#projectImage').value = null;
  }

  const handleSubmitNewProject = () => {
    // setIsLoading(true)
    fetch('https://mublin.herokuapp.com/project/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({ id_user_creator_fk: user.id, projectName: projectName, projectUserName: projectUserName, projectImage: projectImage, foundation_year: foundation_year, end_year: end_year, bio: bio, type: type, kind: kind, public: publicProject })
    })
    .then(response => {
      return response.json();
    }).then(jsonResponse => {
      setIdNewProject(jsonResponse.id)
      handleSubmitParticipationToNewProject(user.id, jsonResponse.id, userStatus, npMain_role_fk)
    }).catch (error => {
      console.error(error)
      alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.")
    })
  }

  return (
    <>
      <Header />
      <Container size="xs" mt={32} mb={40}>
        <Title order={2} mb={14}>
          Cadastrar novo projeto
        </Title>
        <form 
          onSubmit={form.onSubmit(
            (values) => console.log(values),
            (errors) => {
              const firstErrorPath = Object.keys(errors)[0];
              form.getInputNode(firstErrorPath)?.focus();
            },
            handleSubmitNewProject
          )}
        >
          <TextInput
            withAsterisk
            label="Nome do projeto"
            placeholder="Ex: Viajantes do Espaço"
            key={form.key('projectName')}
            {...form.getInputProps('projectName')}
          />
          <TextInput
            mt={8}
            withAsterisk
            label="Username do projeto"
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
          <Flex direction="column" mt={8}>
            <Input.Label>Foto</Input.Label>
            <div style={projectImage ? {display: "none"} : undefined}>
              <IKUpload 
                id='projectImage'
                fileName={"projectPicture_"+projectUsernameFinal+"_.jpg"}
                folder={projectImagePath}
                tags={["project", "avatar"]}
                useUniqueFileName={true}
                isPrivateFile= {false}
                onError={onUploadError}
                onSuccess={onUploadSuccess}
                accept="image/x-png,image/gif,image/jpeg" 
              />
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
          <Grid mt={8}>
            <Grid.Col span={6}>
              <NumberInput
                withAsterisk
                label="Ano de formação"
                min={1800} 
                max={currentYear}
                key={form.key('foundation_year')}
                {...form.getInputProps('foundation_year')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                withAsterisk={!formValues.projectIsActive}
                label="Ano de encerramento"
                min={formValues.foundation_year} 
                max={currentYear}
                disabled={formValues.projectIsActive}
                key={form.key('end_year')}
                {...form.getInputProps('end_year')}
              />
            </Grid.Col>
          </Grid>
          <Checkbox
            mt={8}
            color="violet"
            label="Projeto em atividade atualmente"
            key={form.key('projectIsActive')}
            {...form.getInputProps('projectIsActive', { type: 'checkbox' })}
          />
          <Textarea
            mt={8}
            label="Bio"
            description={formValues.bio.length+'/200'}
            placeholder="Conte um pouco sobre o projeto (opcional)"
            maxLength="220"
            key={form.key('bio')}
            {...form.getInputProps('bio', { type: 'checkbox' })}
          />
          <NativeSelect
            withAsterisk
            label="Sua principal função no projeto"
            mt={6}
            data={[
              { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
              { group: 'Gestão, produção e outros', items: rolesListManagement },
              { group: 'Instrumentos', items: rolesListMusicians },
            ]}
            key={form.key('npMain_role_fk')}
            {...form.getInputProps('npMain_role_fk')}
          />
          <Text size="11px" mt={4} c="dimmed">
            Você também será atribuído automaticamente como Administrador deste novo projeto
          </Text>
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
          <Radio.Group
            mt={8}
            name="favoriteFramework"
            label="Visibilidade"
            description="Exibir o projeto nas buscas?"
            key={form.key('publicProject')}
            {...form.getInputProps('publicProject')}
          >
            <Group mt="xs">
              <Radio color="violet" value="1" label="Público" />
              <Radio color="violet" value="0" label="Privado" />
            </Group>
          </Radio.Group>
          <Group justify="flex-end" mt="md">
            <Button 
              size="md"
              type="submit"
              color="violet"
              loading={isSubmitting}
              disabled={(projectUsernameFinal && projectUsernameAvailability.requested && projectUsernameAvailability.available === false)}
            >
              Cadastrar
            </Button>
          </Group>
        </form>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default New;