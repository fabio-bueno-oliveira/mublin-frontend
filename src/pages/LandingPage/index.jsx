import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/header/public'
import Footer from '../../components/footer/public'
import { useMantineColorScheme, Container, Center, Avatar, Flex, Box, Text, Title, Button, Grid, Image, rem, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { 
  IconAutomaticGearbox,
  IconCalendarSmile,
  IconPlaylist,
  IconUserSearch,
  IconLayoutDashboard,
  IconUsersGroup,
  IconRosetteDiscountCheckFilled,
  IconShieldCheckFilled
} from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react'
import Marquee from "react-fast-marquee";
import './styles.scss';

function LandingPage () {

  document.title = 'Mublin'

  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const { setColorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const imageCdnUrl = 'https://ik.imagekit.io/mublin'
  const AstronautImage1 = imageCdnUrl + '/misc/astronaut-musician-1.png?updatedAt=1731768213783'

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '5px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '1px' };

  const [featuredUsers, setFeaturedUsers] = useState([]);

  useEffect(() => {
    setColorScheme('light');
    fetch('https://mublin.herokuapp.com/home/featuredUsers', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(
        (result) => {
            setFeaturedUsers(result)
        },
        (error) => {
            console.error(error)
        }
      )
  }, []);

  return (
    <>
      {loggedIn &&
        <Navigate to="/home" />
      }
      <Box bg='black' c='white' py='14'>
        <Text ta='center' size={isMobile ? '12px' : '15px'} fw='300' c='dimmed'>
          🚀 40% off no lançamento: Mublin PRO por 3 meses
        </Text>
      </Box>
      <Header />
        <Container size='sm' pt={45}>
          <Title 
            size='2rem'
            fw='800'
            ta='center'
          >
            Gerencie seus projetos de música 🎵
          </Title>
          <Title 
            size='19px'
            ta='center' 
            fw='500'
          >
            Centralize o gerenciamento dos seus projetos de música em um só lugar e simplifique o seu dia a dia na música com apenas alguns cliques.
          </Title>
          <Center>
            <Link to={{ pathname: '/signup' }}>
              <Button
                size="md"
                mt="lg"
                color="violet"
                rightSection={<IconArrowRight size={14}/>}
              >
                Comece grátis
              </Button>
            </Link>
          </Center>
          <Text size="17px" lh="sm" ta="center" mt={47} mb={56}>
            O Mublin é a comunidade onde músicos, produtores e profissionais da música podem conectar com outros artistas e gerenciar seus projetos de música
          </Text>
        </Container>
        <Marquee>
          {featuredUsers?.map((user, key) =>
            <Flex w="170px" h="110px" direction="column" key={key}>
              <Center mb={5}>
                <Avatar src={user.picture ? user.picture : undefined} size="lg" />
              </Center>
              <Flex gap={0} align="center" justify="center" mb={0}>
                <Text size="13px" fw="500" ta="center">{user.name} {user.lastname}</Text>
                {!!user.verified && 
                  <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} />
                }
                {!!user.legend && 
                  <IconShieldCheckFilled style={iconLegendStyle} />
                }
              </Flex>
              <Text size="xs" ta="center">{user.role} {user.genre && ' • ' + user.genre}</Text>
              {user.city && 
                <Text size="11px" ta="center" c="dimmed">{user.city}, {user.uf}</Text>
              }
            </Flex>
          )}
        </Marquee>
        <Container size="sm"mt={50}>
          <Title order={2} ta='center'>
            Aumente suas chances de tocar em <nobr>gigs interessantes</nobr>
          </Title>
          <Grid mt={56}>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconCalendarSmile size={isMobile ? 50 : 80} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Compartilhe informações e datas</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconAutomaticGearbox size={isMobile ? 42 : 60} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Gerencie projetos</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconPlaylist size={isMobile ? 50 : 66} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Confira a playlist dos eventos</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconUserSearch size={isMobile ? 50 : 66} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Encontre músicos disponíveis</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconLayoutDashboard size={isMobile ? 50 : 66} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Cadastre seus equipamentos</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
              <Flex align="center">
                <IconUsersGroup size={isMobile ? 50 : 66} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Encontre projetos em busca de músicos</Text>
              </Flex>
            </Grid.Col>
          </Grid>
          <Center>
            <Image
              h={280}
              src={AstronautImage1}
              fit='contain'
              className='featuredImage'
            />
          </Center>
        </Container>
      <Footer />
    </>
  );
};

export default LandingPage