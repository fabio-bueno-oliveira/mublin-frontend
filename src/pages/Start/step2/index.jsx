import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Grid, Modal, Box, Center, ScrollArea, Group, Text, Title, Textarea, Input, TextInput, Button, Anchor, Loader, Divider } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck, IconSearch, IconAt } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartSecondStep () {

  document.title = "Passo 2";

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const token = localStorage.getItem('token');

  let navigate = useNavigate();

  const user = useSelector(state => state.user);

  const [modalCityOpen, setModalCityOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [initialValues, setInitialValues] = useState({
    gender: user.gender, bio: user.bio, website: user.website, instagram: user.instagram, region: user.region, city: user.city, cityName: user.cityName
  })

  const [formValues, setFormValues] = useState({
    gender: user.gender,
    bio: user.bio,
    website: user.website,
    instagram: user.instagram,
    region: user.region,
    city: user.city,
    cityName: user.cityName
  })

  useEffect(() => { 
    setInitialValues({
      gender: user.gender,
      bio: user.bio,
      website: user.website,
      instagram: user.instagram,
      region: user.region,
      city: user.city,
      cityName: user.cityName
    })
    setFormValues({
      gender: user.gender,
      bio: user.bio,
      website: user.website,
      instagram: user.instagram,
      region: user.region,
      city: user.city,
      cityName: user.cityName
    })
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
    if (valuesUnchanged) {
      navigate('/start/step3');
    } else {
      fetch('https://mublin.herokuapp.com/user/step2', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          userId: user.id, 
          gender: formValues.gender, 
          bio: formValues.bio, 
          website: formValues.website, 
          instagram: formValues.instagram, 
          id_country_fk: 27, 
          id_region_fk: formValues.region, 
          id_city_fk: formValues.city
        })
      }).then((response) => {
        response.json().then((response) => {
          navigate('/start/step3');
          setIsLoading(false);
          setError(false);
        })
      }).catch(err => {
        setIsLoading(false);
        setError(true);
        console.error(err);
      })
    }
  }

  const handleSearchCity = (e, value) => {
    e.preventDefault();
    searchCity(value);
    setNoCitySearchResults(false);
  }

  const selectCityOnModalList = (cityId, cityName) => {
    setFormValues({...formValues, city: cityId, cityName: cityName});
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
      fetch('https://mublin.herokuapp.com/search/cities/'+query+'/'+formValues.region, {
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

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  const valuesUnchanged = (JSON.stringify(initialValues) == JSON.stringify(formValues));

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
          <Textarea
            mt={18}
            size='sm'
            label={<Group gap={2}>Bio (opcional): {formValues.bio && <IconCheck size={16} color='green' />}</Group>}
            description={formValues.bio?.length ? "("+formValues.bio?.length+"/220)" : undefined}
            placeholder="Escreva sua bio"
            value={formValues.bio ? formValues.bio : undefined}
            onChange={(e) => setFormValues({...formValues, bio: e.target.value})}
            disabled={user.requesting}
            maxLength='220'
            autosize
            minRows={2}
            maxRows={4}
          />
          <Grid mt={12}>
            <Grid.Col span={6}>
              <TextInput
                size='sm'
                label={<Group gap={2}>Website (opcional): {formValues.website && <IconCheck size={16} color='green' />}</Group>}
                placeholder="Seu website pessoal"
                value={formValues.website ? formValues.website : undefined}
                onChange={(e) => setFormValues({...formValues, website: e.target.value})}
                disabled={user.requesting}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                size='sm'
                label={<Group gap={2}>Usuário no Instagram (opcional): {formValues.instagram && <IconCheck size={16} color='green' />}</Group>}
                leftSection={<IconAt size={16} />}
                placeholder="john"
                value={formValues.instagram ? formValues.instagram : undefined}
                onChange={(e) => setFormValues({...formValues, instagram: e.target.value})}
                disabled={user.requesting}
              />
            </Grid.Col>
          </Grid>
          <Grid mt={4}>
            <Grid.Col span={6}>
              <NativeSelect
                size='sm'
                label={<Group gap={2}>Gênero: {formValues.gender && <IconCheck size={16} color='green' />}</Group>}
                placeholder="Gênero"
                value={formValues.gender ? formValues.gender : ""}
                onChange={(e) => {
                  setFormValues({...formValues, gender: e.currentTarget.value})
                }}
              >
                <option value="">Selecione</option>
                <option value="m">Masculino</option>
                <option value="f">Feminino</option>
                <option value="n">Não informar</option>
              </NativeSelect>
            </Grid.Col>
            <Grid.Col span={6}>
              <NativeSelect 
                size='sm'
                label={<Group gap={2}>País: <IconCheck size={16} color='green' /></Group>} 
                data={['Brasil']} 
              />
            </Grid.Col>
          </Grid>
          <Text c='dimmed' size='xs' mt={12}>Por enquanto aceitamos apenas cadastros no Brasil.</Text>
          <Text c='dimmed' size='xs'>Iremos expandir para outros países em breve!</Text>
          <Grid mt={12}>
            <Grid.Col span={6}>
              <NativeSelect
                size='sm'
                label={<Group gap={2}>Estado: {formValues.region && <IconCheck size={16} color='green' />}</Group>}
                value={formValues.region ? formValues.region : ""}
                disabled={user.requesting}
                onChange={(e) => {
                  setFormValues({...formValues, region: e.currentTarget.value, city: ''})
                  setSearchValue('');
                  setNoCitySearchResults(false);
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
              {formValues.city ? ( 
                <Input.Wrapper 
                  label={
                    <Group gap={2}>
                      Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />} {formValues.city && <IconCheck size={16} color='green' />}
                    </Group>
                  }
                >
                  <Input 
                    component="button" 
                    size="sm" 
                    pointer
                    onClick={() => setModalCityOpen(true)}
                  >
                    {formValues.cityName}
                  </Input>
                </Input.Wrapper>
              ) : (
                <Input.Wrapper 
                  label={
                    <Group gap={2}>
                      Cidade: {citySearchIsLoading && <Loader color="blue" size="xs" />} {formValues.city && <IconCheck size={16} color='green' />}
                    </Group>
                  }
                >
                  <Input 
                    component="button" 
                    size="sm" 
                    pointer
                    rightSection={formValues.region ? <IconSearch size={16} /> : undefined}
                    onClick={() => setModalCityOpen(true)}
                    disabled={!formValues.region}
                  >
                    {formValues.region ? "Selecione..." : undefined}
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
            disabled={
              !formValues.region || !formValues.city || !formValues.gender || 
              isLoading || 
              citySearchIsLoading
            }
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