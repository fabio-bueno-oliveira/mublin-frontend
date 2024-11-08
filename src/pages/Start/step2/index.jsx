import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Group, Text, Title, Radio, Textarea, Select, Button, Loader, rem } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import HeaderWelcome from '../../../components/header/welcome';

function StartSecondStep () {

  document.title = "Passo 2";

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  let navigate = useNavigate();

  const user = useSelector(state => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [gender, setGender] = useState(user.gender);
  const [bio, setBio] = useState(user.bio);
  const [country, setCountry] = useState(user.country);
  const [region, setRegion] = useState(user.region);
  const [city, setCity] = useState(user.city);

  useEffect(() => { 
    setGender(user.gender);
    setBio(user.bio ? user.bio : "");
    setCountry({
      value: String(user.country),
      label: "Brasil"
    });
    setRegion(user.region);
    setCity(user.city);
    searchCity(user.cityName);
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
        userId: user.id, gender: gender, bio: bio, id_country_fk: country.value, id_region_fk: region, id_city_fk: city
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

  const [queryCities, setQueryCities] = useState([]);
  const [citySearchIsLoading, setCitySearchIsLoading] = useState(false)

  const [searchValue, setSearchValue] = useState('');
  const [lastSearchedCity, setLastSearchedCity] = useState('');

  const typeSearchValue = (query) => {
    setSearchValue(query);
    searchCity(query);
  }

  const searchCity = useDebouncedCallback(async (query) => {
    if (query?.length > 1 && lastSearchedCity !== query) {
      setLastSearchedCity(query);
      setCitySearchIsLoading(true);
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
            }
            setCitySearchIsLoading(false)
          },
          (error) => {
            setCitySearchIsLoading(false)
            alert("Ocorreu um erro ao tentar pesquisar a cidade")
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
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title ta="center" order={5} my={14}>Conte um pouco sobre você</Title>
        <Container size={'xs'} mt={10} mb={130}>
          <Radio.Group
            label={<Group gap={2}>Gênero: {gender && <IconCheck size={16} color='green' />}</Group>}
            name="gender"
            mb={12}
            value={String(gender)}
            onChange={setGender}
          >
            <Group mt={3}>
              <Radio value="m" label="Masculino" />
              <Radio value="f" label="Feminino" />
              <Radio value="n" label="Não informar" />
            </Group>
          </Radio.Group>
          <Textarea
            label={<Group gap={2}>Bio (opcional): {bio && <IconCheck size={16} color='green' />}</Group>}
            description={"("+bio?.length+"/220)"}
            placeholder="Escreva pouco sobre você..."
            value={bio}
            maxLength='220'
            onChange={(e) => setBio(e.target.value)}
          />
          <NativeSelect
            label={<Group gap={2}>País: {country && <IconCheck size={16} color='green' />}</Group>}
            placeholder="Escolha um País"
            data={[{ value: '27', label: 'Brasil' }]}
            defaultValue='27'
            onChange={(e) => setCountry(e.currentTarget.value)}
          />
          <NativeSelect
            label={<Group gap={2}>Estado: {region && <IconCheck size={16} color='green' />}</Group>}
            placeholder="Escolha o Estado"
            value={region ? region : ""}
            onChange={(e) => {
              setRegion(e.currentTarget.value);
              setSearchValue('');
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
          <Select
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
          />
          {/* <TextInput
            label="Pesquise a cidade e selecione no menu"
            onChange={(e) => searchCity(e.currentTarget.value)}
            mt={4}
          />
          <NativeSelect
            placeholder="Escolha a Cidade"
            value={city ? city : null}
            disabled={!region ? true : false}
            // onChange={(_value, option) => setCity(option)}
            // onChange={(_value, option) => console.log(option)}
            onChange={(e) => setCity(e.currentTarget.value)}
            leftSection={city ? <IconCheck size={12} color='green' /> : undefined}
            mt={8}
          >
            {citySearchIsLoading ? ( 
              <option>Carregando...</option>
            ) : (
              <option>Selecione na lista abaixo</option>
            )}
            {queryCities.map((city, key) =>
              <option 
                key={key} 
                value={city.value} 
              >
                {city.text}
              </option>
            )}
          </NativeSelect> */}
        </Container>
        {error && 
          <Text ta="center" mt="md" size='xs'>
            Ocorreu um erro! Tente novamente em alguns instantes
          </Text>
        }
        
      </Container>
      <footer className='onFooter'>
        <Group justify="center">
          <Button variant="default" onClick={() => goToStep1()}
            leftSection={<IconArrowLeft size={14} />}  
          >
            Voltar
          </Button>
          <Button 
            color='violet' onClick={submitForm}
            rightSection={<IconArrowRight size={14} />}
            disabled={!region || !city || !country.value || !gender || isLoading}
          >
            {isLoading ? "Enviando..." : "Avançar"}
          </Button>
        </Group>
      </footer>
    </>
  );
};

export default StartSecondStep;