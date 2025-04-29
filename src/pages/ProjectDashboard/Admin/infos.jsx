import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { userActions } from '../../../store/actions/user'
import { projectInfos } from '../../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Box, Card, Center, Flex, Title, Text, Image, Skeleton, Avatar, Loader, Indicator, Drawer, Button, TextInput, em } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useForm, isNotEmpty, isEmail, hasLength } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconMenu2, IconPlus, IconTrash } from '@tabler/icons-react'
import Header from '../header'
import Navbar from '../navbar'
import MublinLogoBlack from '../../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

function ProjectDashboardAdminInfoPage () {

  const params = useParams();
  const username = params?.username;

  let dispatch = useDispatch();

  const { colorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const user = useSelector(state => state.user);
  const project = useSelector(state => state.project)

  const [opened, { open, close }] = useDisclosure(false)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const activeMembers = project.members.filter(
    (member) => { return member.confirmed === 1 && !member.leftIn }
  )

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      name: '',
      slug: '',
      foundationYear: '',
      endYear: '',
      bio: '',
      website: '',
      instagram: '',
      email: '',
      spotifyId: '',
      genre1: '',
      genre2: '',
      genre3: '',
      country: '',
      region: '',
      city: '',
      public: 1
    },
    validate: {
      name: hasLength({ min: 2 }, 'O nome deve ter no mínimo 2 caracteres'),
      slug: hasLength({ min: 2 }, 'O username deve ter no mínimo 2 caracteres'),
      foundationYear: isNotEmpty('Informe o ano de funcação do projeto'),
      email: isEmail('Email inválido'),
    },
  });

  useEffect(() => {
    if (project.success && project.name) {
      form.setInitialValues({ name: project.name, slug: project.username, foundationYear: project.foundationYear, endYear: project.endDate,
        bio: project.bio,
        website: '',
        instagram: project.instagram,
        email: project.email,
        spotifyId: project.spotifyId,
        genre1: project.genre1,
        genre2: project.genre2,
        genre3: project.genre3,
        country: project.country,
        region: project.region,
        city: project.city, public: project.public ? 1 : 0 })
    }
  }, [project.success, project.name])

  useEffect(() => {
    dispatch(userActions.getInfo())
    dispatch(projectInfos.getProjectInfo(username));
    dispatch(projectInfos.getProjectMembers(username));
  }, [])

  const handleSubmit = (values) => {
    setError(false)
    setIsLoading(true)
    console.log(values)
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

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs">
        <Navbar page='adminInfo' adminPages={true} />
      </Drawer>
      <Grid id='dashboard' gutter={0}>
        <Grid.Col span={{ base: 12, md: 2.5, lg: 2.5 }} id='desktopSidebar' p={14}>
          <Group align='center' gap={6} className='showOnlyInMobile'>
            <Image
              radius='md'
              h={30}
              w='auto'
              fit='contain'
              src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
              ml={6}
            />
            <IconMenu2 size={26} onClick={open} />
          </Group>
          <Box className='showOnlyInLargeScreen'>
            <Navbar desktop page='home' />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          <Header page='Resumo' />
          {project.requesting ? (
            <>
              <Skeleton w={280} h={26} radius='xl' />
              <Skeleton w={190} h={18} radius='xl' mt={6} />
              <Center mt={140}>
                <Loader color='mublinColor' type='bars' />
              </Center>
            </>
          ) : (
            <>
              <Box>
                <Title fz='h2'>Painel de {project.name}</Title>
                <Text size='sm' c='dimmed'>Informações sobre o projeto</Text>
              </Box>


              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box pos='relative' p={10}>
                  {error && 
                    <Alert color="red">Erro ao atualizar os dados do projeto. Tente novamente em instantes</Alert>
                  }
                  {/* <Checkbox
                    color='violet'
                    label={
                      <Group gap={3}>
                        <IconWorld size='17' /><Text>Tornar meu perfil público</Text>
                      </Group>
                    }
                    description='Exibir meu perfil nas buscas internas e nos mecanismos'
                    key={form.key('public')}
                    {...form.getInputProps('public', { type: 'checkbox' })}
                  /> */}
                  {/* <Divider my={10} /> */}
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        size='md'
                        label='Nome do projeto'
                        disabled={project.requesting}
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        size='md'
                        label='Slug (username)'
                        disabled={project.requesting}
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                      />
                    </Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        size='md'
                        label='Ano de fundação'
                        disabled={project.requesting}
                        key={form.key('foundationYear')}
                        {...form.getInputProps('foundationYear')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        size='md'
                        label='Ano de encerramento'
                        disabled={project.requesting}
                        key={form.key('endYear')}
                        {...form.getInputProps('endYear')}
                      />
                    </Grid.Col>
                  </Grid>
                  {/* <TextInput
                    mt='xs'
                    size='md'
                    label='Username'
                    description='O username não pode ser alterado no momento'
                    defaultValue={loggedUsername}
                    disabled
                  />
                  <Textarea
                    mt='xs'
                    size='md'
                    label='Bio'
                    rows='4'
                    maxLength='220'
                    key={form.key('bio')}
                    {...form.getInputProps('bio')}
                  />
                  <TextInput
                    mt='xs'
                    size='md'
                    type='url'
                    label='Website'
                    key={form.key('website')}
                    {...form.getInputProps('website')}
                  />
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        mt='xs'
                        size='md'
                        type='email'
                        label='Email'
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        mt='xs'
                        size='md'
                        type='tel'
                        label='Telefone Celular'
                        maxLength={14}
                        key={form.key('phone')}
                        {...form.getInputProps('phone')}
                      />
                    </Grid.Col>
                  </Grid> */}
                  {/* <Checkbox
                    size={isLargeScreen ? "sm" : "md"}
                    color="violet"
                    label="Exibir telefone no meu perfil"
                    key={form.key('phoneIsPublic')}
                    {...form.getInputProps('phoneIsPublic', { type: 'checkbox' })}
                  /> */}
                  {/* <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        mt='xs'
                        size='md'
                        label='Username do Instagram'
                        leftSection={<IconBrandInstagram size={16} />}
                        key={form.key('instagram')}
                        {...form.getInputProps('instagram')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        mt='xs'
                        size='md'
                        label='Username do TikTok'
                        leftSection={<IconBrandTiktok size={16} />}
                        key={form.key('tiktok')}
                        {...form.getInputProps('tiktok')}
                      />
                    </Grid.Col>
                  </Grid>
                  <NativeSelect
                    mt='xs'
                    size='md'
                    label='Gênero'
                    key={form.key('gender')}
                    {...form.getInputProps('gender')}
                  >
                    <option value=''>Selecione</option>
                    <option value='m'>Masculino</option>
                    <option value='f'>Feminino</option>
                    <option value='n'>Não informar</option>
                  </NativeSelect>
                  <NativeSelect
                    mt='xs'
                    size='md'
                    label='País'
                    key={form.key('country')}
                    {...form.getInputProps('country')}
                  >
                    <option value=''>Selecione</option>
                    <option value='27'>Brasil</option>
                  </NativeSelect>
                  <NativeSelect
                    mt='xs'
                    size='md'
                    label='Estado'
                    key={form.key('region')}
                    {...form.getInputProps('region')}
                    onChange={(e) => {
                      setSearchValue('');
                      setNoCitySearchResults(false);
                      setQueryCities([]);
                      form.setFieldValue('city','');
                      form.setFieldValue('cityName','');
                    }}
                  >
                    <option value=''>Selecione</option>
                    <option value='415'>Acre</option>
                    <option value='422'>Alagoas</option>
                    <option value='406'>Amapa</option>
                    <option value='407'>Amazonas</option>
                    <option value='402'>Bahia</option>
                    <option value='409'>Ceara</option>
                    <option value='424'>Distrito Federal</option>
                    <option value='401'>Espirito Santo</option>
                    <option value='411'>Goias</option>
                    <option value='419'>Maranhao</option>
                    <option value='418'>Mato Grosso</option>
                    <option value='399'>Mato Grosso do Sul</option>
                    <option value='404'>Minas Gerais</option>
                    <option value='408'>Para</option>
                    <option value='405'>Paraiba</option>
                    <option value='413'>Parana</option>
                    <option value='417'>Pernambuco</option>
                    <option value='416'>Piaui</option>
                    <option value='410'>Rio de Janeiro</option>
                    <option value='414'>Rio Grande do Norte</option>
                    <option value='400'>Rio Grande do Sul</option>
                    <option value='403'>Rondonia</option>
                    <option value='421'>Roraima</option>
                    <option value='398'>Santa Catarina</option>
                    <option value='412'>São Paulo</option>
                    <option value='423'>Sergipe</option>
                    <option value='420'>Tocantins</option>
                  </NativeSelect>
                  {form?.getValues()?.cityName ? ( 
                    <Input.Wrapper label='Cidade' mt='xs'>
                      <Input
                        component='button'
                        type='button'
                        size='md'
                        pointer
                        onClick={() => setModalCityOpen(true)}
                      >
                        {form?.getValues()?.cityName}
                      </Input>
                    </Input.Wrapper>
                  ) : (
                    <Input.Wrapper label='Cidade' mt='xs'>
                      <Input
                        component='button'
                        size='md'
                        pointer
                        rightSection={form?.getValues()?.region ? <IconSearch size={16} /> : undefined}
                        onClick={() => setModalCityOpen(true)}
                        disabled={!form?.getValues()?.region}
                      >
                        {form?.getValues()?.region ? 'Selecione...' : undefined}
                      </Input>
                    </Input.Wrapper>
                  )} */}
                  <Group justify='end' mt='lg'>
                    <Button
                      size='lg'
                      type='submit'
                      color='primary'
                      loading={isLoading}
                      loaderProps={{ type: 'dots' }}
                    >
                      Salvar
                    </Button>
                  </Group>
                </Box>
              </form>






              <Grid mt={34}>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Card withBorder p={10} radius='md' className='mublinModule'>
                    <Text size='md' mb={6} fw={600}>Status do projeto</Text>
                    {project.activityStatusId &&
                      <>
                        <Flex
                          align='center'
                          justify='flex-start'
                          gap={6}
                        >
                          <Indicator
                            inline
                            processing={project.activityStatusId === 1 || project.activityStatusId === 3}
                            color={project.activityStatusColor}
                            size={7}
                            ml={5}
                            mr={4}
                          />
                          <Text
                            size='sm'
                            className='lhNormal'
                            pt='1px'
                          >
                            {project.activityStatus}
                          </Text>
                        </Flex>
                      </>
                    }
                  </Card>
                  <Card withBorder p={10} mt={14} radius='md' className='mublinModule'>
                    <Flex justify='space-between'>
                      <Text size='md' mb={12} fw={600}>
                        Recados do time ({project.notes.total})
                      </Text>
                      <Button
                        leftSection={<IconPlus size={14} />} 
                        size='xs' 
                        variant='subtle' 
                        color='primary'
                        onClick={() => setModalNewNote(true)}
                      >
                        Novo recado
                      </Button>
                    </Flex>
                    {project.notes.total === 0 ? (
                      <Text size='sm' c='dimmed'>
                        Nenhum recado no momento
                      </Text>
                    ) : (
                      <Flex direction='column' gap={10}>
                        {project.notes.result.map(item =>
                          <Box key={item.id}>
                            <Flex justify='space-between'>
                              <Group gap={6} mb={5}>
                                <Avatar size={25} src={item.authorPicture} />
                                <Flex direction='column' gap={0}>
                                  <Text size='xs' fw={400} className='lhNormal'>
                                    <strong>{item.authorName} {item.authorLastname}</strong> há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                  </Text>
                                  <Text size='xs' c='dimmed'>@{item.authorUsername}</Text>
                                </Flex>
                              </Group>
                              <Button
                                size='compact-xs'
                                color='red'
                                variant='light'
                                leftSection={<IconTrash size={10} />}
                                onClick={() => showDeleteNoteConfirmation(item.id)}
                              >
                                Deletar
                              </Button>
                            </Flex>
                            <Text size='sm'>{item.note}</Text>
                            <Text size='10px' c='dimmed' mt={6}>
                              {format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}
                            </Text>
                          </Box>
                        )}
                      </Flex>
                    )}
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }} pr={isMobile ? 0 : 100}>
                  <Box>
                    <Image
                      radius='lg'
                      h={120}
                      w='auto'
                      fit='contain'
                      src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
                      mb={14}
                    />
                  </Box>
                  <Text mb={6} size='sm'>
                    <strong>Tipo:</strong> {project.typeName}
                  </Text>
                  <Text mb={6} size='sm'>
                    <strong>Ano de fundação:</strong> {project.foundationYear} {!!project.endDate && <Text span c='dimmed'>(encerrado em {project.endDate})</Text>}
                  </Text>
                  <Text mb={6} size='sm'>
                    <strong>Propósito do projeto:</strong> {project.purpose ? project.purpose : 'Não informado'}
                  </Text>
                  <Avatar.Group spacing={10} mt={6}>
                    {activeMembers.map(member =>
                      <Avatar
                        key={member.id}
                        size='45'
                        name={member.name}
                        title={`${member.name} ${member.lastname} - ${member.role1}`}
                        src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-82,w-82,c-maintain_ratio/'+member.picture} 
                        component='a'
                        href={`/${member.username}`}
                      />
                    )}
                    {/* <Avatar size='30'>+5</Avatar> */}
                  </Avatar.Group>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ProjectDashboardAdminInfoPage;