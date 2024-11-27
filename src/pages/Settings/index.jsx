import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Container, Modal, Center, Loader, Box, ScrollArea, NavLink, Menu, Group, Button, LoadingOverlay, TextInput, Input, Text, Textarea, NativeSelect, Anchor, Divider, Tabs, rem, em } from '@mantine/core';
import { IconUser, IconLock, IconEye, IconAdjustmentsHorizontal, IconCamera, IconSearch, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import { hasLength, isEmail, useForm } from '@mantine/form';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function SettingsPage () {

  const user = useSelector(state => state.user);
  let dispatch = useDispatch();

  document.title = "Configurações | Mublin";

  const isLargeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [modalCityOpen, setModalCityOpen] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      name: '', 
      lastname: '', 
      email: '', 
      gender: '',
      country: '',
      region: '',
      city: '',
      cityName: '',
      bio: ''
    },
    validate: {
      name: hasLength({ min: 3 }, 'O nome deve ter no mínimo 2 caracteres'),
      email: isEmail('Email inválido'),
    },
  });

  useEffect(() => {
    form.setInitialValues({ name: user.name, lastname: user.lastname, email: user.email, gender: user.gender, country: user.country, region: user.region, city: user.city, cityName: user.cityName, bio: user.bio });
    form.setValues({ name: user.name, lastname: user.lastname, email: user.email, gender: user.gender, country: user.country, region: user.region, city: user.city, cityName: user.cityName, bio: user.bio });
  }, [user.success]);

  const handleSubmit = (values) => {
    console.log(47, values)
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

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <Header />
      <Container size={'sm'} mb={80}>
        {isMobile && 
          <Group>
            <Tabs defaultValue="gallery">
              <Tabs.List>
                <Tabs.Tab value="gallery" leftSection={<IconUser style={iconStyle} />}>
                  Minha conta
                </Tabs.Tab>
                <Tabs.Tab value="messages" leftSection={<IconCamera style={iconStyle} />}>
                  Foto de perfil
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Anchor size='sm'>
                  <Group gap={6}>Mais <IconChevronDown size={16} /></Group>
                </Anchor>
                {/* <Button 
                  color="dark"
                  variant="transparent"
                  rightSection={<IconChevronDown size={14} />}
                  style={{ fontWeight: '400'}}
                  size="compact-sm"
                >
                  Mais
                </Button> */}
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconAdjustmentsHorizontal style={{ width: rem(14), height: rem(14) }} />}>
                  Preferências
                </Menu.Item>
                <Menu.Item leftSection={<IconLock style={{ width: rem(14), height: rem(14) }} />}>
                  Senha
                </Menu.Item>
                <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                  Privacidade
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        }
        <Grid mt={30}>
          {isLargeScreen && 
            <Grid.Col span={5} p={24}>
              <NavLink
                href="#required-for-focus"
                label="Minha conta"
                leftSection={<IconUser size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                href="#required-for-focus"
                label="Foto de perfil"
                leftSection={<IconCamera size="1rem" stroke={1.5} />}
              />
              <NavLink
                href="#required-for-focus"
                label="Preferências"
                leftSection={<IconAdjustmentsHorizontal size="1rem" stroke={1.5} />}
              />
              <NavLink
                href="#required-for-focus"
                label="Senha"
                leftSection={<IconLock size="1rem" stroke={1.5} />}
              />
              <NavLink
                href="#required-for-focus"
                label="Privacidade"
                leftSection={<IconEye size="1rem" stroke={1.5} />}
              />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 7 }} pl={isLargeScreen ? 30 : 0}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Box pos="relative" p={10}>
                <LoadingOverlay 
                  visible={user.requesting} 
                  zIndex={1000} 
                  overlayProps={{ radius: "sm", blur: 2 }} 
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Nome"
                      key={form.key('name')}
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Sobrenome"
                      key={form.key('lastname')}
                      {...form.getInputProps('lastname')}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
                  mt="xs"
                  label="Username"
                  description="O username não pode ser alterado no momento"
                  defaultValue={user.username}
                  disabled
                />
                <TextInput
                  mt="xs"
                  label="Email"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                />
                <NativeSelect
                  mt="xs"
                  label="Gênero"
                  key={form.key('gender')}
                  {...form.getInputProps('gender')}
                >
                  <option value="">Selecione</option>
                  <option value="m">Masculino</option>
                  <option value="f">Feminino</option>
                  <option value="n">Não informar</option>
                </NativeSelect>
                <NativeSelect
                  mt="xs"
                  label="País"
                  key={form.key('country')}
                  {...form.getInputProps('country')}
                >
                  <option value="">Selecione</option>
                  <option value="27">Brasil</option>
                </NativeSelect>
                <NativeSelect
                  mt="xs"
                  label="Estado"
                  key={form.key('region')}
                  {...form.getInputProps('region')}
                  onChange={(e) => {
                    setSearchValue('');
                    setNoCitySearchResults(false);
                    setQueryCities([]);
                    form.setFieldValue("city","");
                    form.setFieldValue("cityName","");
                  }}
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
                {form?.getValues()?.cityName ? ( 
                  <Input.Wrapper label="Cidade" mt="xs">
                    <Input 
                      component="button"
                      pointer
                      onClick={() => setModalCityOpen(true)}
                    >
                      {form?.getValues()?.cityName}
                    </Input>
                  </Input.Wrapper>
                ) : (
                  <Input.Wrapper label="Cidade" mt="xs">
                    <Input 
                      component="button"
                      pointer
                      rightSection={form?.getValues()?.region ? <IconSearch size={16} /> : undefined}
                      onClick={() => setModalCityOpen(true)}
                      disabled={!form?.getValues()?.region}
                    >
                      {form?.getValues()?.region ? "Selecione..." : undefined}
                    </Input>
                  </Input.Wrapper>
                )}
                <Textarea
                  mt="xs"
                  label="Bio"
                  rows="4"
                  maxLength="220"
                  key={form.key('bio')}
                  {...form.getInputProps('bio')}
                />
                <Group justify="center" mt="xl">
                  <Button
                    type="submit"
                  >
                    Enviar
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
            <Button color="violet" onClick={() => searchCity(searchValue)}>
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