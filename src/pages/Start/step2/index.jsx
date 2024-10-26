import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { useForm } from '@mantine/form';
import { Container, Stepper, Box, Group, Radio, Textarea, Select, Center, Image, NumberInput, TextInput, Button, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../../components/header';

function StartSecondStep () {

  document.title = "Passo 2 de 4";

  const largeScreen = useMediaQuery('(min-width: 60em)');
  let loggedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector(state => state.user);
  let navigate = useNavigate();

  const [bio, setBio] = useState(user?.bio)
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '', age: 0 },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
    },
  });

  const countryOptions = [
    { key: 'br', text: 'Brasil', value: '27' },
  ]

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

  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  const submitForm = () => {
    fetch('https://mublin.herokuapp.com/user/step2', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({userId: user.id, gender: gender, bio: bio, id_country_fk: id_country_fk, id_region_fk: id_region_fk, id_city_fk: id_city_fk})
    })
      .then(res => res.json())
      .then(() => navigate('/start/step3'))
  }

  const checkLength = (value, maxLength) => {
    if (value.length === maxLength) {
      setMaxLengthReached(true)
    } else {
      setMaxLengthReached(false)
    }
  }

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  const goToStep3 = () => {
    navigate('/start/step3');
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mt={20}>
        <Stepper color="violet" active={1} size={largeScreen ? "sm" : "xs"} orientation={largeScreen ? "horizontal" : "vertical"}>
          <Stepper.Step label="Passo 1" description="Defina sua foto de perfil" />
          <Stepper.Step label="Passo 2" description="Conte um pouco sobre você" />
          <Stepper.Step label="Passo 3" description="Sua ligação com a música" />
          <Stepper.Step label="Passo 4" description="Seus projetos musicais">
            Passo 4: Seus projetos musicais
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Container size={'xs'} mt={20}>
          <form onSubmit={form.onSubmit(console.log)}>
            <Radio.Group
              name="gender"
              label="Gênero"
              mb={12}
            >
              <Group mt="xs">
                <Radio value="m" label="Masculino" />
                <Radio value="f" label="Feminino" />
                <Radio value="n" label="Não informar" />
              </Group>
            </Radio.Group>
            <Textarea
              label="Bio"
              placeholder="Escreva pouco sobre você..."
              value={bio}
              onChange={(e, { value }) => {
                setBio(value)
                checkLength(value, 220)
              }}
            />
            <Select
              label="País"
              placeholder="Escolha um País"
              data={['Brasil', 'Estados Unidos']}
            />
            <Select
              label="Estado"
              placeholder="Escolha o Estado"
              data={['São Paulo', 'Rio de Janeiro']}
            />
          </form>
        </Container>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={() => goToStep1()}>Voltar</Button>
          <Button color='violet' onClick={() => goToStep3()}>Avançar</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartSecondStep;