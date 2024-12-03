import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/header/public'
import Footer from '../../components/footer/public'
import { useMantineColorScheme, Container, Flex, Text, Title, Button, Grid, Image } from '@mantine/core'
import { 
  IconAutomaticGearbox,
  IconCalendarSmile,
  IconPlaylist,
  IconUserSearch,
  IconLayoutDashboard,
  IconUsersGroup
} from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react'
import s from './HeroTitle.module.css'

function LandingPage () {

  document.title = 'Mublin'

  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const { setColorScheme } = useMantineColorScheme()

  const imageCdnUrl = 'https://ik.imagekit.io/mublin'
  const AstronautImage1 = imageCdnUrl + '/misc/astronaut-musician-1.png?updatedAt=1731768213783'
  const AstronautImage2 = imageCdnUrl + '/misc/astronaut-musician-2.png?updatedAt=1731768213743'

  useEffect(() => { 
    setColorScheme('light');
  }, [])

  return (
    <>
      {loggedIn &&
        <Navigate to="/home" />
      }
      <Header />
      <div className={s.wrapper}>
        <Container size={'lg'} className={s.inner}>
          <Grid justify="space-between" align="flex-start">
            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
              <h1 className={s.title}>
                Gerencie{' '}
                <Text component="span" c="violet" inherit>
                  projetos de música
                </Text>{' '}
                com facilidade
              </h1>
              <Text className={s.description} fz="lg" lh="sm">
                O Mublin é a plataforma onde músicos, produtores e profissionais da música podem gerenciar todos os seus projetos, além de se conectar com outras pessoas do mercado musical
              </Text>
              <Link to={{ pathname: '/signup' }}>
                <Button
                  size="lg"
                  mt="lg"
                  className={s.control}
                  color="violet"
                  rightSection={<IconArrowRight size={14}/>}
                >
                  Começar grátis
                </Button>
              </Link>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Image
                h={280}
                src={AstronautImage1}
                fit={'contain'}
              />
            </Grid.Col>
          </Grid>
        </Container>
      </div>
      <div className={s.wrapperFeatured}>
        <Container size={'lg'} className={s.innerSmall}>
          <Title size="h1" mb={'lg'}>Organize suas gigs!</Title>
          <Text className={s.description} fz="lg" lh="sm" mb={'sm'}>
            O Mublin foi desenvolvido para a organização de projetos musicais, facilitando as necessidades de músicos e produtores.
          </Text>
          <Text className={s.description} fz="lg" lh="sm" mb={'xl'}>
            Organize seus projetos em um único lugar e acompanha atualizações como anotações, cronogramas e oportunidades de gigs. Além disso, você pode acompanhar as datas de gravações, ensaios e apresentações.
          </Text>
          <Grid 
            justify="space-between" 
            align="center" 
            columns={12}
            fz="sm"
          >
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconAutomaticGearbox /> Gerencie projetos
            </Grid.Col>
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconCalendarSmile /> Compartilhe informações e datas
            </Grid.Col>
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconPlaylist /> Confira a playlist dos eventos
            </Grid.Col>
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconUserSearch /> Encontre músicos disponíveis
            </Grid.Col>
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconLayoutDashboard /> Cadastre seus equipamentos
            </Grid.Col>
            <Grid.Col 
              className={s.gridFeaturedItem} span="6"
            >
              <IconUsersGroup /> Encontre projetos em busca de músicos
            </Grid.Col>
          </Grid>
        </Container>
      </div>
        <Container size={'lg'} className={s.innerSmall}>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'center' }}
          align={'center'}
        >
          <Text className={s.description} fz="md" lh="sm" pt={'lg'}>
            Com uma interface simples e visual, o Mublin também integra ferramentas de armazenamento em nuvem e sincronização automática, facilitando o acesso aos arquivos em qualquer dispositivo e promovendo uma colaboração eficiente entre os membros do projeto.
          </Text>
          <Image
            h={'160'}
            src={AstronautImage2}
            fit={'contain'}
          />
        </Flex>
        </Container>
      <Footer />
    </>
  );
};

export default LandingPage