import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/user';
import { Grid, Container, Modal, Center, Alert, Loader, Box, ScrollArea, Group, Flex, Button, TextInput, Input, Text, Textarea, NativeSelect, Anchor, Divider } from '@mantine/core';
import { IconSearch, IconChevronLeft, IconBrandInstagram, IconBrandTiktok } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import { hasLength, isEmail, useForm } from '@mantine/form';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import SettingsMenu from './menu';
import { notifications } from '@mantine/notifications';

function SettingsPage () {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  document.title = 'Editar meus dados | Mublin';

  const user = useSelector(state => state.user);

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;
  const loggedUsername = decoded.result.username;

  const isLargeScreen = useMediaQuery('(min-width: 60em)');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalCityOpen, setModalCityOpen] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      name: '',
      lastname: '',
      email: '',
      phone: '',
      phoneIsPublic: '',
      website: '',
      instagram: '',
      tiktok: '',
      gender: '',
      bio: '',
      country: '',
      region: '',
      city: '',
      cityName: '',
      public: 1
    },
    validate: {
      name: hasLength({ min: 3 }, 'O nome deve ter no mínimo 2 caracteres'),
      email: isEmail('Email inválido'),
    },
  });

  useEffect(() => {
    form.setInitialValues({ name: user.name, lastname: user.lastname, email: user.email, phone: user.phone, phoneIsPublic: user.phoneIsPublic ? true : false, website: user.website, instagram: user.instagram, tiktok: user.tiktok, gender: user.gender, bio: user.bio, country: user.country, region: user.region, city: user.city, cityName: user.cityName, public: user.public ? true : false });
    form.setValues({ name: user.name, lastname: user.lastname, email: user.email, phone: user.phone, phoneIsPublic: user.phoneIsPublic ? true : false, website: user.website, instagram: user.instagram, tiktok: user.tiktok, gender: user.gender, bio: user.bio, country: user.country, region: user.region, city: user.city, cityName: user.cityName, public: user.public ? true : false });
  }, [user.success]);

  const handleSubmit = (values) => {
    setError(false);
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/updateProfile', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, name: values.name, lastname: values.lastname ? values.lastname : '', email: values.email, phone_mobile: values.phone ? values.phone : '', phone_mobile_public: values.phoneIsPublic ? 1 : 0, website: values.website ? values.website : '', instagram: values.instagram ? values.instagram : '', tiktok: values.tiktok ? values.tiktok : '', gender: values.gender, bio: values.bio ? values.bio : '', id_country_fk: Number(values.country), id_region_fk: Number(values.region), id_city_fk: Number(values.city), public: values.public ? 1 : 0})
    }).then((response) => {
      response.json().then((response) => {
        window.scrollTo(0, 0);
        setError(false);
        setIsLoading(false);
        dispatch(userActions.getInfo());
        notifications.show({
          position: 'top-center',
          color: 'green',
          title: 'Pronto!',
          message: 'Dados atualizados com sucesso',
        });
      })
    }).catch(err => {
      window.scrollTo(0, 0);
      setError(true);
      setIsLoading(false);
      console.error(err);
    })
  }

  const handleSearchCity = (e, value) => {
    e.preventDefault();
    searchCity(value);
    setNoCitySearchResults(false);
  }

  const selectCityOnModalList = (cityId, cityName) => {
    form.setFieldValue("city", cityId);
    form.setFieldValue("cityName", cityName);
    setModalCityOpen(false);
  }

  const [queryCities, setQueryCities] = useState([]);
  const [citySearchIsLoading, setCitySearchIsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [noCitySearchResults, setNoCitySearchResults] = useState(false);

  const searchCity = useDebouncedCallback(async (query) => {
    if (query?.length > 1) {
      setCitySearchIsLoading(true);
      setNoCitySearchResults(false);
      fetch('https://mublin.herokuapp.com/search/cities/'+query+'/'+form?.getValues()?.region, {
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

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={110}>
        <Grid mt={isLargeScreen ? 0 : 15}>
          {isLargeScreen && 
            <Grid.Col span={4} pt='20'>
              <SettingsMenu page='profileEdit' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap='8' mb='8' className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Text 
                mr='10' 
                className='lhNormal'
                truncate='end'
                size='1.10rem'
                fw='600'
              >
                Meus dados
              </Text>
            </Flex>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Box pos='relative' p={10}>
                {error && 
                  <Alert color="red">Erro ao atualizar os dados. Tente novamente em instantes</Alert>
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
                      label='Nome'
                      disabled={user.requesting}
                      key={form.key('name')}
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      size='md'
                      label='Sobrenome'
                      disabled={user.requesting}
                      key={form.key('lastname')}
                      {...form.getInputProps('lastname')}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
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
                </Grid>
                {/* <Checkbox
                  size={isLargeScreen ? "sm" : "md"}
                  color="violet"
                  label="Exibir telefone no meu perfil"
                  key={form.key('phoneIsPublic')}
                  {...form.getInputProps('phoneIsPublic', { type: 'checkbox' })}
                /> */}
                <Grid>
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
                )}
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
          </Grid.Col>
        </Grid>
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
            <Button color='violet' onClick={() => searchCity(searchValue)}>
              Pesquisar
            </Button>
          </Grid.Col>
        </Grid>
        {citySearchIsLoading && 
          <Center my={20}>
            <Loader color="violet" size="sm" type="bars" />
          </Center>
        }
        {!!(queryCities.length && !citySearchIsLoading) && 
          <>
            <Text size='xs' c='dimmed' mt={10} mb={10}>
              {queryCities?.length} {queryCities?.length === 1 ? "cidade localizada" : "cidades localizadas"} 
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

export default SettingsPage;