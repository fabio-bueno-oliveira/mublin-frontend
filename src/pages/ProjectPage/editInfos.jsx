import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Group, Box, Center, Text, Skeleton, Loader, Button, TextInput, Textarea, NativeSelect, NumberInput, Checkbox } from '@mantine/core'
import { useFetch } from '@mantine/hooks'
import { useForm, isNotEmpty, isEmail, hasLength } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconBrandInstagram, IconBrandSoundcloud, IconBrandSpotify, IconLink } from '@tabler/icons-react'

function ProjectAdminEditInfos () {

  const project = useSelector(state => state.project)

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: projectTypes, loading: loadingProjectTypes } = useFetch(
    'https://mublin.herokuapp.com/projects/types'
  )

  const form = useForm({
    mode: 'controlled',
    initialValues: { 
      activityStatus: '',
      kind: '',
      type: '',
      name: '',
      slug: '',
      foundationYear: '',
      endYear: '',
      bio: '',
      purpose: '',
      website: '',
      instagram: '',
      email: '',
      spotifyId: '',
      soundcloud: '',
      genre1: '',
      genre2: '',
      genre3: '',
      country: '',
      region: '',
      city: '',
      public: 1,
      currentlyOnTour: false
    },
    validate: {
      activityStatus: isNotEmpty('Informe o status do projeto'),
      type: isNotEmpty('Informe o tipo do projeto'),
      kind: isNotEmpty('Informe o conteúdo do projeto'),
      name: hasLength({ min: 2 }, 'O nome deve ter no mínimo 2 caracteres'),
      slug: hasLength({ min: 2 }, 'O username deve ter no mínimo 2 caracteres'),
      foundationYear: isNotEmpty('Informe o ano de funcação do projeto')
    },
    onValuesChange: (values) => {
      if (values.activityStatus === "2" || values.activityStatus === 2) {
        form.setFieldValue("currentlyOnTour", false);
      }
    },
  })

  useEffect(() => {
    if (project.success && project.name) {
      form.setInitialValues({ 
        activityStatus: project.activityStatusId,
        kind: project.kind,
        type: project.typeId,
        name: project.name,
        slug: project.username,
        foundationYear: project.foundationYear,
        endYear: project.endDate,
        bio: project.bio,
        purpose: project.purpose,
        website: '',
        instagram: project.instagram,
        email: project.email,
        spotifyId: project.spotifyId,
        soundcloud: project.soundcloud,
        genre1: project.genre1,
        genre2: project.genre2,
        genre3: project.genre3,
        country: project.country,
        region: project.region,
        city: project.city, 
        public: project.public ? 1 : 0,
        currentlyOnTour: project.currentlyOnTour
      })
      form.setValues({ 
        activityStatus: project.activityStatusId,
        kind: project.kind,
        type: project.typeId,
        name: project.name, 
        slug: project.username, 
        foundationYear: project.foundationYear, 
        endYear: project.endDate,
        bio: project.bio,
        purpose: project.purpose,
        website: project.website,
        instagram: project.instagram,
        email: project.email,
        spotifyId: project.spotifyId,
        soundcloud: project.soundcloud,
        genre1: project.genre1,
        genre2: project.genre2,
        genre3: project.genre3,
        country: project.country,
        region: project.region,
        city: project.city, 
        public: project.public ? 1 : 0,
        currentlyOnTour: project.currentlyOnTour
      })
    }
  }, [project.success])

  const handleSubmit = (values) => {
    // setIsLoading(true)
    setError(false)
    // console.log(values)
    notifications.show({
      position: 'top-center',
      color: 'red',
      title: 'Ops!',
      message: 'Não foi possível atualizar os dados no momento. Tente novamente em instantes!',
    });
    // fetch('https://mublin.herokuapp.com/user/updateProfile', {
    //   method: 'PUT',
    //   headers: {
    //     'Accept': 'application/json, text/plain, */*',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + token
    //   },
    //   body: JSON.stringify({userId: loggedUserId, name: values.name, lastname: values.lastname ? values.lastname : '', email: values.email, phone_mobile: values.phone ? values.phone : '', phone_mobile_public: values.phoneIsPublic ? 1 : 0, website: values.website ? values.website : '', instagram: values.instagram ? values.instagram : '', tiktok: values.tiktok ? values.tiktok : '', gender: values.gender, bio: values.bio ? values.bio : '', id_country_fk: Number(values.country), id_region_fk: Number(values.region), id_city_fk: Number(values.city), public: values.public ? 1 : 0})
    // }).then((response) => {
    //   response.json().then((response) => {
    //     window.scrollTo(0, 0);
    //     setError(false);
    //     setIsLoading(false);
    //     dispatch(userActions.getInfo());
    //     notifications.show({
    //       position: 'top-center',
    //       color: 'green',
    //       title: 'Pronto!',
    //       message: 'Dados atualizados com sucesso',
    //     });
    //   })
    // }).catch(err => {
    //   window.scrollTo(0, 0);
    //   setError(true);
    //   setIsLoading(false);
    //   console.error(err);
    // })
  }

  const currentYear = new Date().getFullYear()

  return (
    <>
      {project.requesting ? (
        <>
          <Skeleton w={280} h={26} radius='xl' />
          <Skeleton w={190} h={18} radius='xl' mt={6} />
          <Center mt={140}>
            <Loader color='mublinColor' type='bars' />
          </Center>
        </>
      ) : (
        project.loggedUserIsAdmin ? (
          <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Box pos='relative' p={10}>
                {error && 
                  <Alert color="red">
                    Erro ao atualizar os dados do projeto. Tente novamente em instantes
                  </Alert>
                }
                <NativeSelect
                  withAsterisk
                  label='Status do projeto'
                  key={form.key('activityStatus')}
                  {...form.getInputProps('activityStatus')}
                >
                  <option value=''>Selecione</option>
                  <option value={1}>Projeto em atividade</option>
                  <option value={2}>Projeto encerrado</option>
                  <option value={3}>Projeto ativo vez em quando</option>
                  <option value={4}>Projeto sazonal / de temporada</option>
                  <option value={5}>Projeto ainda em construção</option>
                  <option value={6}>Projeto em Hiato/Parado</option>
                </NativeSelect>
                <Checkbox
                  my={8}
                  size='xs'
                  color='mublinColor'
                  label='Em turnê atualmente'
                  disabled={form.getValues().activityStatus === 2 || form.getValues().activityStatus === "2"}
                  key={form.key('currentlyOnTour')}
                  {...form.getInputProps('currentlyOnTour', { type: 'checkbox' })}
                />
                <Grid mt={8}>
                  <Grid.Col span={6}>
                    <NativeSelect
                      withAsterisk
                      label='Conteúdo principal'
                      key={form.key('kind')}
                      {...form.getInputProps('kind')}
                    >
                      <option value={1}>Autoral</option>
                      <option value={2}>Cover</option>
                      <option value={3}>Autoral + Cover</option>
                    </NativeSelect>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NativeSelect
                      withAsterisk
                      label='Tipo do Projeto'
                      key={form.key('type')}
                      {...form.getInputProps('type')}
                    >
                      {loadingProjectTypes &&
                        <option value=''>
                          Carregando...
                        </option>
                      }
                      {projectTypes?.map(type =>
                        <option key={type.id} value={Number(type.id)}>
                          {type.namePTBR}
                        </option>
                      )}
                    </NativeSelect>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      withAsterisk
                      label='Nome do projeto'
                      disabled={project.requesting}
                      key={form.key('name')}
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      withAsterisk
                      label='Slug (username)'
                      disabled={project.requesting}
                      key={form.key('slug')}
                      {...form.getInputProps('slug')}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
                  mt={8}
                  type='email'
                  label='Email'
                  disabled={project.requesting}
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      withAsterisk
                      label='Ano de fundação'
                      disabled={project.requesting}
                      key={form.key('foundationYear')}
                      {...form.getInputProps('foundationYear')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      withAsterisk={form.getValues().activityStatus === 2 || form.getValues().activityStatus === "2"}
                      label="Ano de encerramento"
                      min={form.getValues().foundationYear} 
                      max={currentYear}
                      disabled={form.getValues().activityStatus !== 2 && form.getValues().activityStatus !== "2"}
                      key={form.key('endYear')}
                      {...form.getInputProps('endYear')}
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Website'
                      type='url'
                      leftSection={<IconLink size={16} />}
                      disabled={project.requesting}
                      key={form.key('website')}
                      {...form.getInputProps('website')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Usuário no Instagram'
                      leftSection={<IconBrandInstagram size={16} />}
                      disabled={project.requesting}
                      key={form.key('instagram')}
                      {...form.getInputProps('instagram')}
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Spotify ID'
                      leftSection={<IconBrandSpotify size={16} />}
                      disabled={project.requesting}
                      key={form.key('spotifyId')}
                      {...form.getInputProps('spotifyId')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Usuário no Soundcloud'
                      leftSection={<IconBrandSoundcloud size={16} />}
                      disabled={project.requesting}
                      key={form.key('soundcloud')}
                      {...form.getInputProps('soundcloud')}
                    />
                  </Grid.Col>
                </Grid>
                <Textarea
                  mt={8}
                  label='Bio'
                  rows='3'
                  maxLength='220'
                  key={form.key('bio')}
                  {...form.getInputProps('bio')}
                />
                <Textarea
                  mt={8}
                  label='Propósito do projeto'
                  rows='3'
                  maxLength='220'
                  key={form.key('purpose')}
                  {...form.getInputProps('purpose')}
                />
                <Grid mt={8}>
                  <Grid.Col span={4}>
                    <TextInput
                      label='País'
                      disabled
                      defaultValue={project.country}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Estado'
                      disabled
                      defaultValue={project.region}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Cidade'
                      disabled
                      defaultValue={project.city}
                    />
                  </Grid.Col>
                </Grid>
                <Text c='dimmed' size='xs' my={10}>
                  Edição de localização não disponível no momento
                </Text>
                <Group justify='end' mt='lg'>
                  <Button
                    size='md'
                    type='submit'
                    color='mublinColor'
                    loading={isLoading}
                    loaderProps={{ type: 'dots' }}
                  >
                    Salvar
                  </Button>
                </Group>
              </Box>
            </form>
          </>
        ) : (
          <Text>Você não tem acesso ao painel administrativo deste projeto</Text>
        )
      )}
    </>
  )
}

export default ProjectAdminEditInfos