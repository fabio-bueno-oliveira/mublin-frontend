import React from 'react';
import Header from '../../components/public/header';
import { Footer } from '../../components/public/footer';
import { Container, Text, Title, Button, Group, Grid, Image, Flex } from '@mantine/core';
import AstronautImage1 from '../../assets/img/astronaut-musician-1.png';
import AstronautImage2 from '../../assets/img/astronaut-musician-2.png';
import { 
  IconAutomaticGearbox,
  IconCalendarSmile,
  IconPlaylist,
  IconUserSearch,
  IconLayoutDashboard,
  IconUsersGroup
} from '@tabler/icons-react';
import s from './HeroTitle.module.css';

function LandingPage () {

    document.title = 'Mublin';

    return (
      <>
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
                <Text className={s.description} fz="xl" lh="sm">
                  O Mublin é a plataforma onde músicos, produtores e profissionais da música podem gerenciar todos os seus projetos, além de se conectar com outras pessoas do mercado musical
                </Text>
                <Group className={s.controls}>
                  <Button
                    size="lg"
                    className={s.control}
                    color="violet"
                  >
                    Começar
                  </Button> 
                  <Button
                    component="a"
                    href="https://github.com/mantinedev/mantine"
                    size="lg"
                    variant="default"
                    className={s.control}
                  >
                    Saber mais
                  </Button>
                </Group>
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
            <Text className={s.description} fz="xl" lh="sm" mb={'xl'}>
              O Mublin foi desenvolvido para a organização de projetos musicais, facilitando as necessidades de músicos e produtores. O Mublin permite que os usuários organizem cadastrem seus projetos em um único lugar e acompanhem as atualizações como anotações, cronogramas, oportunidades de gigs. Além disso, você pode acompanhar as datas de gravações, ensaios e apresentações.
            </Text>
            <Grid 
              justify="space-between" 
              align="center" 
              columns={12}
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
        <div className={s.wrapperFeaturedMini}>
          <Container size={'lg'} className={s.innerSmall}>
            <div className={s.textWithImage}>
              <Image
                h={160}
                src={AstronautImage2}
                fit={'contain'}
              />
              <Text className={s.description} fz="xl" lh="sm" pt={'lg'}>
                Com uma interface simples e visual, o Mublin também integra ferramentas de armazenamento em nuvem e sincronização automática, facilitando o acesso aos arquivos em qualquer dispositivo e promovendo uma colaboração eficiente entre os membros do projeto.
              </Text>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
};

export default LandingPage;