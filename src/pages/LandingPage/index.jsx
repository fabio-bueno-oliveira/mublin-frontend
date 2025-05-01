import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/header/public'
import Footer from '../../components/footer/public'
import { useMantineColorScheme, Container, Center, Avatar, Flex, Box, Text, Title, Button, Grid, Image, Anchor, rem, em } from '@mantine/core'
import { useMediaQuery, useFetch } from '@mantine/hooks'
import { Helmet } from 'react-helmet'
import { 
  IconAutomaticGearbox,
  IconCalendarSmile,
  IconGuitarPick,
  IconUserSearch,
  IconLayoutDashboard,
  IconArrowRight,
  IconUsersGroup,
  IconRosetteDiscountCheckFilled,
  IconShieldCheckFilled
} from '@tabler/icons-react'
import Marquee from 'react-fast-marquee'
import './styles.scss'

function LandingPage () {

  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const { setColorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const imageCdnUrl = 'https://ik.imagekit.io/mublin'
  const AstronautImage1 = imageCdnUrl + '/misc/astronaut-musician-1.png?updatedAt=1731768213783'

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '5px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '1px' }

  const [featuredUsers, setFeaturedUsers] = useState([])
  
  const { data: featuredBrands, loading: loadingFeaturedBrands } = useFetch(
    'https://mublin.herokuapp.com/home/featuredBrands'
  );

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
          content='Gerencie seus projetos de música, cadastre seus equipamentos e conecte-se com artistas e produtores do mercado musical' 
        />
      </Helmet>
      {loggedIn &&
        <Navigate to='/home' />
      }
      <Box bg='black' c='white' py='14'>
        <Link to='/pricing'>
          <Text ta='center' size={isMobile ? '12px' : '15px'} fw='330' c='dimmed'>
            🚀 40% off no lançamento: Mublin PRO
          </Text>
        </Link>
      </Box>
      <Header />
      <Box component='main' id='landing'>
        <Container size='xs' my={50}>
          <Title 
            size='1.9rem'
            fw='750'
            ta='center'
            mb={8}
          >
            Cadastre seus equipamentos e <nobr>projetos de <Text span variant="gradient" gradient={{ from: 'indigo', to: 'grape', deg: 90 }} size='2rem' fw='750'>música</Text></nobr>
          </Title>
          <Text 
            size='md'
            className='lhNormal'
            ta='center' 
            fw='400'
          >
            Compartilhe seus setups, toque em mais gigs e conecte com produtores, artistas e pessoas do mercado musical
          </Text>
          <Center>
            <Link to={{ pathname: '/signup' }}>
              <Button
                size='xl'
                mt='lg'
                radius='md'
                color='mublinColor'
                variant='gradient'
                gradient={{ from: 'mublinColor', to: 'violet', deg: 90 }}
                rightSection={<IconArrowRight size={14}/>}
              >
                Comece grátis
              </Button>
            </Link>
          </Center>
          <Anchor underline='hover' href='/pricing'>
            <Text size='sm' ta='center' mt={8}>
              Confira os planos
            </Text>
          </Anchor>
        </Container>
        <Title 
          size='1.2rem'
          fw='600'
          ta='center'
          mb={14}
          mt={30}
        >
          Centenas de marcas cadastradas
        </Title>
        <Marquee speed={30}>
          {featuredBrands?.map(brand =>
            <Flex
              key={brand.id}
              w='110px'
              h='110px'
              direction='column'
            >
              <Center mb={5}>
                <Image
                  src={brand.logo ? `https://ik.imagekit.io/mublin/products/brands/tr:h-120,w-120,cm-pad_resize,bg-FFFFFF/${brand.logo}` : 'https://placehold.co/110x110?text=Carregando...'}
                  style={{boxShadow:'2px 2px 7px rgba(0,0,0,0.15)',}}
                  withBorder
                  radius='lg'
                  h={60}
                  w={60}
                  alt={brand.name}
                />
              </Center>
              <Flex gap={0} align='center' justify='center' mb={0}>
                <Text c='black' size='12px' fw='500' ta='center'>
                  {brand.name}
                </Text>
              </Flex>
            </Flex>
          )}
        </Marquee>
        <Marquee>
          {featuredUsers?.map((user, key) =>
            <Flex 
              key={key} 
              component='a' 
              href={`/${user.username}`}
              w='160px' 
              h='110px' 
              direction='column'
            >
              <Center mb={5}>
                <Avatar src={user.picture ? user.picture : undefined} size='lg' />
              </Center>
              <Flex gap={0} align='center' justify='center' mb={0}>
                <Text c='black' size='13px' fw='550' ta='center'>
                  {user.name} {user.lastname}
                </Text>
                {!!user.verified && 
                  <IconRosetteDiscountCheckFilled color='#0977ff' style={iconVerifiedStyle} />
                }
                {!!user.legend && 
                  <IconShieldCheckFilled style={iconLegendStyle} />
                }
              </Flex>
              <Text size='xs' ta='center' c='dark'>
                {user.role} {user.genre && ' • ' + user.genre}
              </Text>
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
                <IconGuitarPick size={40} color="#252525" />
                <Text c="#252525" size={isMobile ? "13px" : "16px"}>Veja setups dos seus ídolos</Text>
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
          <Text ta='center' size='xs' mt={20}>
            Em breve disponível em versão app para Android e iOS
          </Text>
          <Center mb={40}>
            <Image 
              h='auto'
              w={345}
              fit='contain'
              opacity={0.4}
              src='https://ik.imagekit.io/mublin/misc/app-store-soon.jpg' 
            />
          </Center>
        </Container>
      </Box>
      <Footer />
    </>
  )
}

export default LandingPage