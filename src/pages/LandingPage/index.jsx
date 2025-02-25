import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/header/public'
import Footer from '../../components/footer/public'
import { useMantineColorScheme, Container, Center, Avatar, Flex, Box, Text, Title, Button, Grid, Image, Anchor, rem, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Helmet } from 'react-helmet'
import { 
  IconAutomaticGearbox,
  IconCalendarSmile,
  IconPlaylist,
  IconUserSearch,
  IconLayoutDashboard,
  IconUsersGroup,
  IconRosetteDiscountCheckFilled,
  IconShieldCheckFilled
} from '@tabler/icons-react'
import Marquee from 'react-fast-marquee'
import './styles.scss'

function LandingPage () {

  document.title = 'Mublin'

  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const { setColorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const imageCdnUrl = 'https://ik.imagekit.io/mublin'
  const AstronautImage1 = imageCdnUrl + '/misc/astronaut-musician-1.png?updatedAt=1731768213783'

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '5px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '1px' }

  const [featuredUsers, setFeaturedUsers] = useState([])

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
  }, [])

  return (
    <>
      <Helmet>
        <title>Mublin - A rede dos músicos</title>
        <link rel='canonical' href='https://mublin.com' />
        <meta 
          name='description' 
          content='Centralize o gerenciamento dos seus projetos de música e conecte-se com artistas e produtores do mercado musical' 
        />
      </Helmet>
      {loggedIn &&
        <Navigate to='/home' />
      }
      <Box bg='black' c='white' py='14'>
        <Link to='/pricing'>
          <Text ta='center' size={isMobile ? '12px' : '15px'} fw='330' c='dimmed'>
            🚀 40% off no lançamento: Mublin PRO por 3 meses
          </Text>
        </Link>
      </Box>
      <Header />
      <Container size='sm' my={50}>
        <Title 
          size='1.9rem'
          fw='750'
          ta='center'
          mb={8}
        >
          Gerencie seus projetos de <Text span variant="gradient" gradient={{ from: 'indigo', to: 'grape', deg: 90 }} size='2rem' fw='750'>música</Text>
        </Title>
        <Text 
          size='md'
          className='lhNormal'
          ta='center' 
          fw='400'
        >
          Cadastre seus projetos e equipamentos. Consiga novas gigs e conecte com produtores, artistas e pessoas do mercado musical
        </Text>
        <Center>
          <Link to={{ pathname: '/signup' }}>
            <Button
              size='xl'
              mt='lg'
              radius='xl'
              color='mublinColor'
              // variant='gradient'
              // gradient={{ from: 'mublinColor', to: 'violet', deg: 90 }}
              // rightSection={<IconArrowRight size={14}/>}
            >
              Comece grátis
            </Button>
          </Link>
        </Center>
        <Anchor underline='hover' href='/pricing'>
          <Text size='xs' ta='center' mt={6}>
            Confira os planos
          </Text>
        </Anchor>
      </Container>
      <Marquee>
        {featuredUsers?.map((user, key) =>
          <Flex w='170px' h='110px' direction='column' key={key}>
            <Center mb={5}>
              <Avatar src={user.picture ? user.picture : undefined} size='lg' />
            </Center>
            <Flex gap={0} align='center' justify='center' mb={0}>
              <Text size='13px' fw='500' ta='center'>{user.name} {user.lastname}</Text>
              {!!user.verified && 
                <IconRosetteDiscountCheckFilled color='#0977ff' style={iconVerifiedStyle} />
              }
              {!!user.legend && 
                <IconShieldCheckFilled style={iconLegendStyle} />
              }
            </Flex>
            <Text size='xs' ta='center'>{user.role} {user.genre && ' • ' + user.genre}</Text>
            {user.city && 
              <Text size='11px' ta='center' c='dimmed'>{user.city}, {user.uf}</Text>
            }
          </Flex>
        )}
      </Marquee>
      <Container size='sm'mt={50}>
        <Title 
          size='1.55rem'
          fw='700'
          ta='center'
          mb={8}
        >
          Aumente suas chances de tocar em <nobr>gigs interessantes</nobr>
        </Title>
        <Text size='md' lh='sm' ta='center'>
          O Mublin é a comunidade onde músicos, produtores e profissionais da música podem conectar com outros artistas e gerenciar seus projetos de música
        </Text>
        <Grid mt={56}>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconCalendarSmile size={50} color="#252525" />
              <Text c="#252525" size={isMobile ? "13px" : "16px"}>Compartilhe informações e datas</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconAutomaticGearbox size={40} color="#252525" />
              <Text c="#252525" size={isMobile ? "13px" : "16px"}>Gerencie projetos</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconPlaylist size={40} color="#252525" />
              <Text c="#252525" size={isMobile ? "13px" : "16px"}>Confira a playlist dos eventos</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconUserSearch size={40} color="#252525" />
              <Text c="#252525" size={isMobile ? "13px" : "16px"}>Encontre músicos disponíveis</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconLayoutDashboard size={40} color="#252525" />
              <Text c="#252525" size={isMobile ? "13px" : "16px"}>Cadastre seus equipamentos</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 6, lg: 4 }}>
            <Flex align='center' gap={4}>
              <IconUsersGroup size={40} color="#252525" />
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
  )
}

export default LandingPage