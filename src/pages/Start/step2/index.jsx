import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Grid, Modal, Box, Center, ScrollArea, Group, Text, Title, Textarea, Input, TextInput, Button, Anchor, Loader, Divider, rem } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck, IconSearch } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartSecondStep () {

  document.title = "Passo 2";

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  let navigate = useNavigate();

  const user = useSelector(state => state.user);

  // Modal city select
  const [modalCityOpen, setModalCityOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [gender, setGender] = useState(user.gender);
  const [bio, setBio] = useState(user.bio);
  const [region, setRegion] = useState(user.region);
  const [city, setCity] = useState(user.city);
  const [cityName, setCityName] = useState(user.city);

  useEffect(() => { 
    setGender(user.gender);
    setBio(user.bio ? user.bio : "");
    setRegion(user.region);
    setCity(user.city);
    setCityName(user.cityName);
    if (!user.region) {
      setModalCityOpen(false);
    }
  }, [user.id]);

  const regionOptions = [
    { key: '', text: 'Selecione...', value: '' },
    { key: 'AC', text: 'Acre', value: '415' },
    { key: 'AL', text: 'Alagoas', value: '422' },
    { key: 'AP', text: 'Amapá', value: '406' },
    { key: 'AM', text: 'Amazonas', value: '407' },
    { key: 'BA', text: 'Bahia', value: '402' },
    { key: 'CE', text: 'Ceará', value: '409' },
    { key: 'DF', text: 'Distrito Federal', value: '424' },
    { key: 'ES', text: 'Espírito Santo', value: '401' },
    { key: 'GO', text: 'Goiás', value: '411' },
    { key: 'MA', text: 'Maranhão', value: '419' },
    { key: 'MT', text: 'Mato Grosso', value: '418' },
    { key: 'MS', text: 'Mato Grosso do Sul', value: '399' },
    { key: 'MG', text: 'Minas Gerais', value: '404' },
    { key: 'PA', text: 'Pará', value: '408' },
    { key: 'PB', text: 'Paraíba', value: '405' },
    { key: 'PR', text: 'Paraná', value: '413' },
    { key: 'PE', text: 'Pernambuco', value: '417' },
    { key: 'PI', text: 'Piauí', value: '416' },
    { key: 'RJ', text: 'Rio de Janeiro', value: '410' },
    { key: 'RN', text: 'Rio Grande do Norte', value: '414' },
    { key: 'RS', text: 'Rio Grande do Sul', value: '400' },
    { key: 'RO', text: 'Rondônia', value: '403' },
    { key: 'RR', text: 'Roraima', value: '421' },
    { key: 'SC', text: 'Santa Catarina', value: '398' },
    { key: 'SP', text: 'São Paulo', value: '412' },
    { key: 'SE', text: 'Sergipe', value: '423' },
    { key: 'TO', text: 'Tocantins', value: '420' },
  ]

  const submitForm = () => {
    setIsLoading(true);
    fetch('https://mublin.herokuapp.com/user/step2', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({
        userId: user.id, 
        gender: gender, 
        bio: bio, 
        id_country_fk: 27, 
        id_region_fk: region, 
        id_city_fk: city
      })
    }).then((response) => {
      response.json().then((response) => {
        navigate('/start/step3')
        setIsLoading(false);
        setError(false);
      })
    }).catch(err => {
      setIsLoading(false);
      setError(true);
      console.error(err);
    })
  }

  const handleSearchCity = (e, value) => {
    e.preventDefault();
    searchCity(value);
    setNoCitySearchResults(false);
  }

  const selectCityOnModalList = (cityId, cityName) => {
    setCity(cityId);
    setCityName(cityName);
    setModalCityOpen(false);
  }

  const [queryCities, setQueryCities] = useState([]);
  const [citySearchIsLoading, setCitySearchIsLoading] = useState(false)

  const [searchValue, setSearchValue] = useState('');
  const [noCitySearchResults, setNoCitySearchResults] = useState(false);
  // const [lastSearchedCity, setLastSearchedCity] = useState('');

  // const typeSearchValue = (query) => {
  //   setSearchValue(query);
  //   searchCity(query);
  // }

  const searchCity = useDebouncedCallback(async (query) => {
    if (query?.length > 1) {
      // setLastSearchedCity(query);
      setCitySearchIsLoading(true);
      setNoCitySearchResults(false);
      fetch('https://mublin.herokuapp.com/search/cities/'+query+'/'+region, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(
          (result) => {
            if (result?.length) {
              // setQueryCities(result);
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

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  return (
    <>
      <HeaderWelcome />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={1} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
          <Stepper.Step />
        </Stepper>
        <Title ta="center" order={3} my={14}>Conte um pouco sobre você</Title>
        <Container px={largeScreen ? undefined : 0} size={largeScreen ? 'xs' : 'lg'} mt={10} mb={130}>
          <NativeSelect
            size='md'
            label={<Group gap={2}>Gênero: {gender && <IconCheck size={16} color='green' />}</Group>}
            placeholder="Gênero"
            value={gender ? gender : ""}
            onChange={(e) => {
              setGender(e.currentTarget.value);
            }}
          >
            <option value="">Selecione</option>
            <option value="m">Masculino</option>
            <option value="f">Feminino</option>
            <option value="n">Não informar</option>
          </NativeSelect>
          <Textarea
            mt={18}
            size='md'
            label={<Group gap={2}>Bio (opcional): {bio && <IconCheck size={16} color='green' />}</Group>}
            description={"("+bio?.length+"/220)"}
            placeholder="Escreva pouco sobre você..."
            value={bio ? bio : undefined}
            maxLength='220'
            autosize
            minRows={2}
            maxRows={4}
            onChange={(e) => setBio(e.target.value)}
          />
          <Grid mt={18}>
            <Grid.Col span={6}>
              <NativeSelect
                size='md'
                label={<Group gap={2}>Estado: {region && <IconCheck size={16} color='green' />}</Group>}
                placeholder="Escolha o Estado"
                value={region ? region : ""}
                onChange={(e) => {
                  setRegion(e.currentTarget.value);
                  setSearchValue('');
                  setNoCitySearchResults(false);
                  setCity('');
                  setQueryCities([]);
                }}
              >
                {regionOptions.map((region, key) =>
                  <option key={key} value={region.value}>
                    {region.text}
                  </option>
                )}
              </NativeSelect>
            </Grid.Col>
            <Grid.Col span={6}>
              {/* <Select
                size='md'
                label={
                  <Group gap={2}>
                    Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />} {city && <IconCheck size={16} color='green' />}
                  </Group>
                }
                placeholder={region ? "Digite e selecione uma cidade" : "Selecione o Estado antes"}
                readOnly={!region}
                searchable
                searchValue={searchValue}
                onSearchChange={typeSearchValue}
                onChange={(_value, option) => { 
                  setCity(option?.value); 
                }}
                data={queryCities}
                allowDeselect={false}
                value={String(city)}
                nothingFoundMessage="Nenhuma cidade encontrada..."
              /> */}
              {city ? ( 
                <Input.Wrapper 
                  label={
                    <Group gap={2}>
                      Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />} {city && <IconCheck size={16} color='green' />}
                    </Group>
                  }
                >
                  <Input 
                    component="button" 
                    size="md" 
                    pointer
                    onClick={() => setModalCityOpen(true)}
                  >
                    {cityName}
                  </Input>
                </Input.Wrapper>
              ) : (
                <Input.Wrapper 
                  label={
                    <Group gap={2}>
                      Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />} {city && <IconCheck size={16} color='green' />}
                    </Group>
                  }
                >
                  <Input 
                    component="button" 
                    size="md" 
                    pointer
                    rightSection={region ? <IconSearch size={16} /> : undefined}
                    onClick={() => setModalCityOpen(true)}
                    disabled={!region}
                  >
                    {region ? "Selecione..." : undefined}
                  </Input>
                </Input.Wrapper>
              )}
            </Grid.Col>
          </Grid>
        </Container>
        {error && 
          <Text ta="center" mt="md" size='xs'>
            Ocorreu um erro! Tente novamente em alguns instantes
          </Text>
        }
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
      <footer className='onFooter'>
        <Group justify="center">
          <Button 
            variant="default" 
            size='lg'
            onClick={() => goToStep1()}
            leftSection={<IconArrowLeft size={14} />}  
          >
            Voltar
          </Button>
          <Button 
            color='violet' 
            size='lg'
            onClick={submitForm}
            rightSection={<IconArrowRight size={14} />}
            disabled={!region || !city || !gender || isLoading || citySearchIsLoading}
            loading={isLoading}
          >
            Avançar
          </Button>
        </Group>
      </footer>
    </>
  );
};

export default StartSecondStep;