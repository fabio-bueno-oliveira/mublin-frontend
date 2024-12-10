import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate, Link } from 'react-router-dom'
import { profileInfos } from '../../store/actions/profile'
import { followInfos } from '../../store/actions/follow'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Flex, Grid, Affix, Space, Transition, Paper, Center, Stack, Title, Text, Anchor, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, useMantineColorScheme, Modal, Button, Radio, Badge, ScrollArea, Alert, Tooltip, Divider, ActionIcon, Accordion, Indicator, rem, em } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconStar, IconStarFilled, IconBrandInstagram, IconMail, IconChevronDown, IconLink, IconLockSquareRoundedFilled, IconX } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { useMediaQuery } from '@mantine/hooks'
import PartnersModule from './partners'
import PianoLogoBlack from '../../assets/svg/piano-logo.svg'
import PianoLogoWhite from '../../assets/svg/piano-logo-w.svg'
import CarouselProjects from './carouselProjects'
import classes from './carousel.module.scss'
import './styles.scss'

function ProfilePage () {

  let navigate = useNavigate()
  const params = useParams()
  const username = params?.username
  const loggedUser = JSON.parse(localStorage.getItem('user'))
  const user = useSelector(state => state.user)
  const profile = useSelector(state => state.profile)

  const largeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme()

  let dispatch = useDispatch()
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username))
    dispatch(followInfos.checkProfileFollowing(username))
    dispatch(profileInfos.getProfileAvailabilityItems(username))
    dispatch(profileInfos.getProfileFollowers(username))
    dispatch(profileInfos.getProfileFollowing(username))
    dispatch(profileInfos.getProfileProjects(username))
    dispatch(profileInfos.getProfileRoles(username))
    dispatch(profileInfos.getProfileGenres(username))
    dispatch(profileInfos.getProfileGear(username))
    dispatch(profileInfos.getProfileGearSetups(username))
    dispatch(profileInfos.getProfilePartners(username))
    dispatch(profileInfos.getProfileStrengths(username))
    dispatch(profileInfos.getProfileStrengthsTotalVotes(username))
    dispatch(profileInfos.getProfileStrengthsRaw(username))

    fetch('https://mublin.herokuapp.com/strengths/getAllStrengths', {
      method: 'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+loggedUser.token
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
            setStrengthsLoaded(true)
            setStrengths(result)
        },
        (error) => {
            setStrengthsLoaded(true)
            console.error(error)
        }
      )
  }, [username]);

  document.title = `${profile.name} ${profile.lastname} | Mublin`;

  const followedByMe = useSelector(state => state.followedByMe);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '5px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '5px', cursor: "pointer" };

  // Projects
  const allProjects = profile.projects.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 });
  // const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 });
  // const portfolioProjects = profile.projects.filter((project) => { return project.portfolio === 1 && project.confirmed === 1 });

  // Badges
  const [modalLegendOpen, setModalLegendOpen] = useState(false);

  // Gear
  const [gearSetup, setGearSetup] = useState('');
  const [gearCategorySelected, setGearCategorySelected] = useState('');

  const selectSetup = (setupId) => {
    setGearCategorySelected('');
    setGearSetup(setupId);
  }

  const gear = useSelector(state => state.profile.gear).filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 });

  const gearFiltered = gearSetup ? gear.filter((product) => { 
    return profile.gearSetups.products.find(x => x.id === product.productId && x.setupId === Number(gearSetup)) 
  }) : gear;

  const gearTotal = gearFiltered.filter((product) => { return product.productId > 0 });

  // Modal Follow Info
  const [modalFollowInfoOpen, setModalFollowInfoOpen] = useState(false);
  // Modal Bio
  const [modalBioOpen, setModalBioOpen] = useState(false);
  // Modal Contact
  const [modalContactOpen, setModalContactOpen] = useState(false);
  // Modal Followers
  const [modalFollowersOpen, setModalFollowersOpen] = useState(false);
  // Modal Following
  const [modalFollowingOpen, setModalFollowingOpen] = useState(false);

  const followUnfollow = () => {
    setModalFollowInfoOpen(false);
    if (!followedByMe.following || followedByMe.following === 'false') {
      setLoadingFollow(true);
      fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
        }
      })
      .then((response) => {
        dispatch(followInfos.checkProfileFollowing(username));
        dispatch(profileInfos.getProfileFollowers(username));
        setLoadingFollow(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao tentar seguir o usuário");
      })
    } else if (followedByMe.following === 'true') {
      setLoadingFollow(true);
      fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
        method: 'delete',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
        }
      })
      .then((response) => {
        dispatch(followInfos.checkProfileFollowing(username));
        dispatch(profileInfos.getProfileFollowers(username));
        setLoadingFollow(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao deixar de seguir o usuário");
      })
    }
  }

  const changeInspirationStatus = (id, followedId, option) => {
    fetch('https://mublin.herokuapp.com/profile/'+profile.username+'/updateInspiration', {
      method: 'PUT',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({id: id, followedId: followedId, option: option})
        }).then((response) => {
          response.json().then((response) => {
            dispatch(followInfos.checkProfileFollowing(username));
          })
        }).catch(err => {
          console.error(err)
        })
  }

  const goToProfile = (username) => {
    setModalFollowersOpen(false);
    setModalFollowingOpen(false);
    navigate('/'+username);
  }

  // Strentgth points
  const [modalStrengthsOpen, setModalStrengthsOpen] = useState(false)
  const [strengthsLoaded, setStrengthsLoaded] = useState(false)
  const [strengths, setStrengths] = useState([])
  const [strengthVoted, setStrengthVoted] = useState(null)
  const [strengthVotedName, setStrengthVotedName] = useState('')

  const myVotes = profile.strengthsRaw.filter((x) => { return x.idUserFrom === loggedUser.id})
    .map(x => ({ 
      id: x.id,
      idUserTo: x.idUserTo,
      idUserFrom: x.idUserFrom,
      strengthId: x.strengthId,
      icon: x.icon,
      strengthTitle: x.strengthTitle
    }))

  const voteProfileStrength = (strengthId, strengthTitle) => {
    setStrengthsLoaded(false)
    fetch('https://mublin.herokuapp.com/profile/voteStrength', {
      method: 'POST',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
      },
      body: JSON.stringify({strengthId: strengthId, profileId: profile.id, nameTo: profile.name, emailTo: profile.email, strengthTitle: strengthTitle})
    })
    .then((response) => {
      dispatch(profileInfos.getProfileStrengths(username));
      dispatch(profileInfos.getProfileStrengthsRaw(username));
      setStrengthsLoaded(true)
      setStrengthVoted(null)
      setStrengthVotedName(null)
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro. Tente novamente em instantes")
    })
  }

  const unVoteProfileStrength = (voteId) => {
    setStrengthsLoaded(false)
    fetch('https://mublin.herokuapp.com/profile/'+voteId+'/unvoteStrength', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loggedUser.token
        }
    })
    .then((response) => {
        dispatch(profileInfos.getProfileStrengths(username));
        dispatch(profileInfos.getProfileStrengthsRaw(username));
        setStrengthsLoaded(true)
        setStrengthVoted(null)
        setStrengthVotedName(null)
    }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao remover o voto. Tente novamente em instantes")
    })
  }

  const [scroll] = useWindowScroll();

  const truncate = (input) => input.length > 17 ? `${input.substring(0, 17)}...` : input;

  return (
    <>
      {profile.id && 
        <Affix 
          w='100%'
          position={{ top: 0, left: 0 }} 
        >
          <Transition 
            transition="slide-down" 
            duration={400} 
            timingFunction="ease" 
            mounted={largeScreen ? scroll.y > 100 : scroll.y > 50}
          >
            {(transitionStyles) => (
              <Container className='floatingMenu' style={transitionStyles} fluid h={50} py={9}>
                <Container size={largeScreen ? 'lg' : undefined} p={isMobile ? 0 : undefined}>
                  <Group gap={3}>
                    <Link to={{ pathname: `/home` }}>
                      <Image 
                        src={colorScheme === 'light' ? PianoLogoBlack : PianoLogoWhite} 
                        h={largeScreen ? 29 : 27} 
                      />
                    </Link>
                    <Avatar
                      size={largeScreen ? 'sm' : 'sm'}
                      src={profile.picture ? profile.picture : undefined}
                      ml={10}
                      mr={4}
                    />
                    <Flex direction="column">
                      <Box w={largeScreen ? 400 : 200}>
                        <Text fw="500" size={largeScreen ? "14px" : "12px"} >
                          {profile.name} {profile.lastname}
                        </Text>
                        <Text size='11px' truncate="end">
                          {profile.roles.map((role, key) =>
                          <span key={key} className="comma">
                            {role.description}
                          </span>
                          )}
                        </Text>
                        <Text c="dimmed" size='9px' mt={2}>
                          {!!profile.city && profile.city}{profile.region && `, ${profile.region}`}
                        </Text>
                      </Box>
                    </Flex>
                  </Group>
                </Container>
              </Container>
            )}
          </Transition>
        </Affix>
      }
      <Header pageType='profile' username={username} profileId={profile.id} />
      {profile.id && 
        <Container size={'lg'} mb={largeScreen ? 30 : 82} pt={largeScreen ? 10 : 0} className='profilePage'>
          <Grid>
            <Grid.Col pr={22} span={{ base: 12, md: 12, lg: 4 }}>
              {profile.requesting && 
                <>
                  <Group justify='flex-start'>
                    <Skeleton height={84} circle />
                    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                      <Skeleton height={18} width={240} radius="xl" />
                      <Skeleton height={11} width={240} radius="xl" />
                      <Skeleton height={14} width={240} radius="xl" />
                    </SimpleGrid>
                  </Group>
                  <Skeleton height={15} width={420} mt={16} radius="xl" />
                  <Skeleton height={15} width={450} mt={5} mb={20} radius="xl" />
                </>
              }
              {!profile.requesting && 
                <Paper 
                  radius="md" 
                  withBorder={largeScreen ? false : false}
                  px={largeScreen ? 0 : 0} 
                  py={largeScreen ? 0 : 0} 
                  style={isMobile ? { backgroundColor: 'transparent' } : { backgroundColor: 'transparent' }}
                >
                  <Flex
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="nowrap"
                    columnGap="xs"
                  >
                    <Indicator 
                      color='gray'
                      position="bottom-center" 
                      withBorder 
                      inline 
                      label={<Text size="9px">PRO</Text>} 
                      size={15}
                      disabled={profile.plan === "Free"}
                    >
                      <Avatar
                        size={largeScreen ? 'xl' : 'lg'}
                        src={profile.picture}
                      />
                    </Indicator>
                    <Box style={{overflow:'hidden'}}>
                      <Flex align={'center'} mt={0}>
                        <Title order={isMobile ? 4 : 3} fw={460} mb={3}>
                          {profile.name} {profile.lastname}
                        </Title>
                        {!!profile.verified && 
                          <Tooltip label="Usuário Verificado">
                            <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                          </Tooltip>
                        }
                        {!!profile.legend && 
                          <IconShieldCheckFilled
                            style={iconLegendStyle}
                            onClick={() => setModalLegendOpen(true)}
                          />
                        }
                      </Flex>
                      <Carousel 
                        slideSize={{ base: '100%', sm: '100%' }}
                        slideGap={{ base: 'xl', sm: 'xl' }}
                        align='start'
                        slidesToScroll={isMobile ? 2 : 3}
                        height={14}
                        withControls={false}
                        dragFree
                        className='carousel-roles'
                      >
                        {profile.roles.map((role, key) =>
                          <Flex gap={1} key={key} className='carousel-item'>
                            {role.icon && 
                              <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' className={colorScheme === "dark" ? "invertPngColor" : undefined} />
                            }
                            <Text size='13px' fw='400' mr={8}>
                              {role.name}
                            </Text>
                          </Flex>
                        )}
                      </Carousel>
                      <Text size={largeScreen ? '13px' : '12px'} fw='400' c="dimmed" mt={5}>
                        {profile.city}{profile.region && `, ${profile.region}`}
                      </Text>
                    </Box>
                  </Flex>
                  <Group 
                    gap={12} 
                    mt={largeScreen ? 13 : 11} 
                    mb={largeScreen ? 10 : 9}
                  >
                    <Text 
                      className='point' 
                      size={largeScreen ? '0.9rem' : '0.9rem'} 
                      fw='430'
                      onClick={() => setModalFollowersOpen(true)}
                      style={{lineHeight: 'normal'}}
                    >
                      {profile.followers.total} seguidores
                    </Text>
                    <Text 
                      className='point' 
                      size={largeScreen ? '0.9rem' : '0.9rem'} 
                      fw='430'
                      onClick={() => setModalFollowingOpen(true)}
                      style={{lineHeight: 'normal'}}
                    >
                      {profile.following.total} seguindo
                    </Text>
                  </Group>
                  {(profile.bio && profile.bio !== 'null') && 
                    <Text 
                      size={isMobile ? '0.86em' : '0.83em'} 
                      mt={5} lineClamp={3}
                      onClick={isMobile ? () => setModalBioOpen(true) : undefined}
                      pr={isMobile ? 0 : 26}
                      style={{lineHeight:'1.11em'}}
                    >
                      {profile.bio}
                    </Text>
                  }
                  {profile.website && 
                    <Anchor 
                      href={profile.website} 
                      target="_blank" 
                      underline="hover" 
                      style={{display:'block',width:'fit-content'}} 
                      c='#6565ff'
                      mt={isMobile ? 12 : 8}
                      mb={6}
                    >
                      <Flex gap={2} align="center">
                        <IconLink size={13} />
                        <Text size={largeScreen ? "0.83em" : "0.84em"}>
                          {profile.website}
                        </Text>
                      </Flex>
                    </Anchor>
                  }
                  <Flex gap={5} mt={14}>
                    {loggedUser.id !== profile.id ? (
                      <Button 
                        size={largeScreen ? "xs" : "xs"} 
                        fz={largeScreen ? "14px" : "14px"}
                        fw={largeScreen ? "500" : "500"}
                        color={colorScheme === "light" ? "dark" : "gray"}
                        variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
                        loading={loadingFollow}
                        rightSection={followedByMe?.following === 'true' ? <IconChevronDown size={14} /> : undefined}
                        fullWidth={isMobile}
                        onClick={
                          followedByMe?.following === 'true' 
                            ? () => setModalFollowInfoOpen(true)
                            : () => followUnfollow() 
                        }
                      >
                        {followedByMe?.following === 'true' ? 'Seguindo' : 'Seguir'}
                      </Button>
                    ) : (
                      <Button 
                        size={largeScreen ? "xs" : "xs"} 
                        fz={largeScreen ? "14px" : "14px"}
                        fw={largeScreen ? "500" : "500"}
                        variant='light'
                        color={colorScheme === "light" ? "dark" : "gray"}
                        fullWidth={isMobile}
                        onClick={() => navigate('/settings')}
                      >
                        Editar perfil
                      </Button>
                    )}
                    <Button 
                      size={largeScreen ? "xs" : "xs"}
                      fz={largeScreen ? "14px" : "14px"}
                      fw={largeScreen ? "500" : "500"}
                      variant='light'
                      color={colorScheme === "light" ? "dark" : "gray"}
                      leftSection={<IconMail size={14} />} 
                      fullWidth={isMobile}
                      onClick={() => setModalContactOpen(true)}
                    >
                      Contato
                    </Button>
                    {profile.instagram && 
                      <>
                        <ActionIcon 
                          size={largeScreen ? "30px" : "30"}
                          w={largeScreen ? "30px" : "30"}
                          variant='light'
                          color={colorScheme === "light" ? "dark" : "gray"}
                          component="a"
                          href={`https://instagram.com/${profile.instagram}`}
                          target='_blank'
                        >
                          <IconBrandInstagram style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                      </>
                    }
                  </Flex>
                  {profile.availabilityId && 
                    <>
                      <Divider mt="md" mb="xs" label="Disponibilidade:" labelPosition="left" />
                      <Flex 
                        align="center"
                        justify="flex-start"
                        gap={2} 
                        mb={largeScreen ? 12 : 0} 
                      >
                        <Indicator 
                          inline
                          processing={profile.availabilityId}
                          color={profile.availabilityColor}
                          size={8}
                          ml={5}
                          mr={7}
                        />
                        <Text 
                          fz={largeScreen ? "15px" : "14px"} 
                          fw={500}
                        >
                          {profile.availabilityTitle}
                        </Text>
                      </Flex>
                      {largeScreen && 
                        <Box>
                          <Text size="0.83em" fw={400} mb={5}>
                            Principais estilos musicais:
                          </Text>
                          {profile.genres[0].id ? (
                            <>
                              {profile.requesting ? (
                                <Text size='xs' mx={0} c="dimmed">Carregando...</Text>
                              ) : (
                                <Flex gap={3} mx={0} pt={2}>
                                  {profile.genres[0].id && profile.genres.map((genre, key) =>
                                    <Badge variant="default" size="xs" key={key}>
                                      {genre.name}
                                    </Badge>
                                  )}
                                </Flex>
                              )}
                            </>
                          ) : (
                            <Text size='xs' mx={0} c="dimmed">
                              Nenhum estilo cadastrado
                            </Text>
                          )}
                          <Text size="0.83em" fw={400} mb={5} mt={14}>
                            Tipos de projetos:
                          </Text>
                          <Group gap={4}>
                            {profile.requesting ? (
                              <Text size='xs' mx={0}>Carregando...</Text>
                            ) : (
                              <Flex gap={3} mx={0} pt={2}>
                                {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
                                  <Badge variant="default" size="xs">Autorais</Badge>
                                }
                                {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
                                  <Badge variant="default" size="xs">Contratado</Badge>
                                }
                              </Flex>
                            )}
                          </Group>
                          <Text size="0.83em" fw={400} mb={5} mt={14}>
                            Tipos de trabalho:
                          </Text>
                          {profile.availabilityItems[0].id ? (
                            <Flex gap={3} mx={0} pt={2}>
                              {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                                <Badge variant="default" size="xs" key={key}>
                                  {item.itemName}
                                </Badge>
                              )}
                            </Flex>
                          ) : (
                            <Text size="xs" c="dimmed">
                              Não informado
                            </Text>
                          )}
                        </Box>
                      }
                      {isMobile && 
                        <Accordion chevronPosition="left">
                          <Accordion.Item value="Exibir mais detalhes" style={{border:'0px'}}>
                            <Accordion.Control p={0} fz="sm"  withBorder={false}>
                              Exibir mais detalhes
                            </Accordion.Control>
                            <Accordion.Panel pb={12}>
                              <Box>
                                <Text size="0.83em" fw={400} mb={5}>
                                  Principais estilos musicais:
                                </Text>
                                {profile.genres[0].id ? (
                                  <>
                                    {profile.requesting ? (
                                      <Text size='xs' mx={0} c="dimmed">Carregando...</Text>
                                    ) : (
                                      <Flex gap={3} mx={0} pt={2}>
                                        {profile.genres[0].id && profile.genres.map((genre, key) =>
                                          <Badge variant="default" size="xs" key={key}>
                                            {genre.name}
                                          </Badge>
                                        )}
                                      </Flex>
                                    )}
                                  </>
                                ) : (
                                  <Text size='xs' mx={0} c="dimmed">
                                    Nenhum estilo cadastrado
                                  </Text>
                                )}
                                <Text size="0.83em" fw={400} mb={5} mt={14}>
                                  Tipos de projetos:
                                </Text>
                                <Group gap={4}>
                                  {profile.requesting ? (
                                    <Text size='xs' mx={0}>Carregando...</Text>
                                  ) : (
                                    <Flex gap={3} mx={0} pt={2}>
                                      {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
                                        <Badge variant="default" size="xs">Autorais</Badge>
                                      }
                                      {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
                                        <Badge variant="default" size="xs">Contratado</Badge>
                                      }
                                    </Flex>
                                  )}
                                </Group>
                                <Text size="0.83em" fw={400} mb={5} mt={14}>
                                  Tipos de trabalho:
                                </Text>
                                {profile.availabilityItems[0].id ? (
                                  <Flex gap={3} mx={0} pt={2}>
                                    {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                                      <Badge variant="default" size="xs" key={key}>
                                        {item.itemName}
                                      </Badge>
                                    )}
                                  </Flex>
                                ) : (
                                  <Text size="xs" c="dimmed">
                                    Não informado
                                  </Text>
                                )}
                              </Box>
                            </Accordion.Panel>
                          </Accordion.Item>
                        </Accordion>
                      }
                    </> 
                  }
                </Paper>
              }
              {(isMobile && profile.availabilityId) && 
                <Divider mb={8} mt={10} />
              }
              {(profile.plan === "Pro" && profile.total) && 
                <PartnersModule loading={profile.requesting} partners={profile.partners} />
              }
              {(isMobile && !profile.availabilityId) && 
                <Space h="xs" />
              }
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
              <Group justify="flex-start" align="center" gap={8} mb={8}>
                <Title order={5} fw={500}>Pontos Fortes</Title>
                {(profile.id !== loggedUser.id && !profile.requesting) && 
                  <Button 
                    size="compact-xs"
                    variant="outline"
                    color={colorScheme === "light" ? "dark" : "gray"}
                    onClick={() => setModalStrengthsOpen(true)}
                  >
                    Votar
                  </Button>
                }
              </Group>
              <Paper
                radius="md"
                withBorder={largeScreen ? true : false}
                px={largeScreen ? 13 : 0}
                py={largeScreen ? 11 : 0}
                mb={14}
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className="mublinModule"
              >
                {profile.requesting ? ( 
                  <Text size='sm'>Carregando...</Text>
                ) : (
                  <>
                    {(profile.strengths.total && profile.strengths.result[0].idUserTo === profile.id) ? ( 
                      <>
                        <Carousel 
                          slideSize="22%"
                          slidesToScroll={isMobile ? 4 : 4}
                          align='start'
                          // slidesToScroll={isMobile ? 2 : 7}
                          height={62}
                          dragFree
                          controlsOffset='6px'
                          controlSize={24}
                          withControls={true}
                          classNames={classes}
                        >
                          {profile.strengths.result.map((strength, key) =>
                            <>
                              <Flex 
                                justify="flex-start"
                                align="center"
                                direction="column"
                                wrap="wrap"
                                className="carousel-strengths"
                                key={key}
                              >
                                <i className={strength.icon}></i>
                                <Text fw={500} mb={2} mt={3} size='sm' align='center' truncate="end">
                                  {strength.strengthTitle}
                                </Text>
                                <Text size='11px'>
                                  {strength.totalVotes + (strength.totalVotes > 1 ? ' votos' : ' voto')}
                                </Text>
                              </Flex>
                            </>
                          )}
                        </Carousel>
                      </>
                    ) : (
                      <Text size='xs'>
                        Nenhum ponto forte votado para {profile.name} até o momento
                      </Text>
                    )}
                  </>
                )}
              </Paper>
              <Group justify="flex-start" align="center" gap={8} mb={8}>
                <Title order={5} fw={500}>Projetos ({profile?.projects?.length})</Title>
                {(profile.id === loggedUser.id && !profile.requesting && profile.plan === "Free") && 
                  <Text 
                    size="sm"
                    c="dimmed"
                  >
                    Assine Mublin PRO e gerencie quantos projetos quiser!
                  </Text>
                }
              </Group>
              {/* <Group justify="flex-start" align="center" gap={8} mb={8}>
                <Title order={5} fw={500}>
                  Projetos ({profile?.projects?.length})
                </Title>
                {(profile.id !== loggedUser.id && !profile.requesting) && 
                  <Button 
                    size="compact-xs"
                    variant="outline"
                    color={colorScheme === "light" ? "dark" : "gray"}
                  >
                    Convidar {profile.name} para um projeto
                  </Button>
                }
              </Group> */}
              <Paper 
                radius="md" 
                withBorder 
                px={13}
                py={11}
                mb={12}
                className="mublinModule"
              >
                <>
                  {profile.requesting ? ( 
                    <Text size='sm'>Carregando...</Text>
                  ) : (
                    <CarouselProjects 
                      profile={profile}
                      projects={allProjects}
                      profilePlan={profile.plan}
                    />
                  )}
                </>
              </Paper>
              {profile.plan === "Pro" ? ( 
                <>
                  <Title order={5} fw={500} mb={8}>Equipamento</Title>
                  <Paper 
                    radius="md" 
                    withBorder={largeScreen ? true : false}
                    px={largeScreen ? 15 : 0} 
                    pt={largeScreen ? 11 : 0}
                    pb={largeScreen ? 16 : 0}
                    mb={25}
                    className="mublinModule"
                    style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                  >
                    {profile.requesting ? ( 
                      <Text size='sm'>Carregando...</Text>
                    ) : (
                      <>
                        {profile.gear[0]?.brandId && 
                          <Group gap={10} mb={14}>
                            <NativeSelect 
                              size={largeScreen ? "xs" : "sm"}
                              w={136}
                              // onChange={(e) => setGearSetup(e.target.options[e.target.selectedIndex].value)}
                              onChange={(e) => selectSetup(e.target.options[e.target.selectedIndex].value)}
                            >
                              <option value="">Setup completo</option>
                              {profile.gearSetups.total && profile.gearSetups.setups.map((setup, key) =>
                                <option key={key} value={setup.id}>
                                  {setup.name}
                                </option>
                              )}
                            </NativeSelect>
                            {!gearSetup && 
                              <NativeSelect
                                size={largeScreen ? "xs" : "sm"}
                                w={136}
                                onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value="">
                                  {'Exibir tudo ('+gearTotal.length+')'}
                                </option>
                                {profile.gearCategories.map((gearCategory, key) =>
                                  <option key={key} value={gearCategory.category}>
                                    {truncate(gearCategory.category) + '(' + gearCategory.total + ')'}
                                  </option>
                                )}
                              </NativeSelect>
                            }
                          </Group>
                        }
                        {profile.gear[0]?.brandId ? ( 
                          <>
                            <Carousel 
                              slideSize={{ base: '100%', sm: '100%' }}
                              slideGap={{ base: 'xl', sm: 'xl' }}
                              align='start'
                              slidesToScroll={isMobile ? 3 : 4}
                              pt={8}
                              height={210}
                              controlsOffset='6px'
                              controlSize={24}
                              withControls={true}
                              dragFree
                              classNames={classes}
                            >
                              {gearFiltered.map((product, key) =>
                                <Flex 
                                  direction='column' 
                                  justify='flex-start' 
                                  align='center' 
                                  className='carousel-gear' 
                                  key={key}
                                >
                                  <Link to={{ pathname: `/gear/product/${product.productId}` }}>
                                    <Image 
                                      src={'https://ik.imagekit.io/mublin/products/tr:h-120,w-120,cm-pad_resize,bg-FFFFFF/'+product.pictureFilename} 
                                      // w={150}
                                      mb={10}
                                      radius='md'
                                      onClick={() => history.push('/gear/product/'+product.productId)}
                                    />
                                  </Link>
                                  <Box w={110}>
                                    <Text size='11px' fw={550} mb={3} truncate="end" title={product.brandName}>
                                      {product.brandName}
                                    </Text>
                                    <Text size="sm" truncate="end" title={product.productName}>
                                      {product.productName}
                                    </Text>
                                  </Box>
                                  {product.tuning && 
                                    <>
                                      <Group gap={2} mt={4}>
                                        <Text size='9px' fw={500}>Afinação: {product.tuning}</Text>
                                      </Group>
                                      <Text size='9px'>{product.tuningDescription}</Text>
                                    </>
                                  }
                                  {!!product.forSale && 
                                    <Flex direction="column" align="center" gap={4} mt={4}>
                                      <Badge size="xs" color="dark">À venda</Badge>
                                      {!!product.price && 
                                        <Text size='10px' fw={500}>
                                          {product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                                        </Text>
                                      }
                                    </Flex>
                                  }
                                </Flex>
                              )}
                            </Carousel>
                          </>
                        ) : (
                          <Text size='xs'>Nenhum equipamento cadastrado</Text>
                        )}
                      </>
                    )}
                  </Paper>
                </>
              ) : (
                <>
                  {user.id === profile.id && 
                    <>
                      <Group gap={3} mb={8}>
                        <Title order={5} fw={500}>Equipamento</Title>
                        <IconLockSquareRoundedFilled size={22} color="gray" /> 
                      </Group>
                      <Paper 
                        radius="md" 
                        withBorder={largeScreen ? true : false}
                        px={15} 
                        pt={11}
                        pb={16}
                        mb={25}
                        className="mublinModule"
                        // style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                      >
                        <Text size="sm">
                          Torne-se PRO para liberar esta funcionalidade em seu perfil!
                        </Text>
                        <Anchor 
                          href={`https://buy.stripe.com/8wM03sfPadmmc4EaEE?client_reference_id=${profile.id}&prefilled_email=${profile.email}&utm_source=gear`} 
                          target="_blank"
                          underline="never"
                        >
                          <Text size="xs" c="violet">
                            Assinar Mublin PRO - R$ 30,00 por 3 meses (pagamento único)
                          </Text>
                        </Anchor>
                      </Paper>
                    </>
                  }
                </>
              )}
            </Grid.Col>
          </Grid>
        </Container>
      }
      <Modal 
        centered
        opened={modalFollowInfoOpen} 
        onClose={() => setModalFollowInfoOpen(false)} 
        title={
          <Group mt={12} gap={8}>
            <Avatar
              size="md"
              src={profile.picture}
            />
            <Flex direction="column">
              <Text size="sm" fw="500">
                {`${profile.name} ${profile.lastname}`}
              </Text>
              <Text size="xs" c="dimmed">
                {username}
              </Text>
            </Flex>
          </Group>
        }
      >
        <Stack
          align="stretch"
          justify="center"
          gap="xs"
        >
          {followedByMe.inspiration ? (
            <Button 
              size="sm" 
              color={colorScheme === "light" ? "dark" : "gray"}
              variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
              rightSection={<IconStarFilled size={14} />}
              onClick={() => changeInspirationStatus(followedByMe.id, profile.id, "0")}
            >
              Remover como inspiração
            </Button>
          ) : (
            <Button 
              size="sm" 
              color={colorScheme === "light" ? "dark" : "gray"}
              variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
              rightSection={<IconStar size={14} />}
              onClick={() => changeInspirationStatus(followedByMe.id, profile.id, "1")}
            >
              Adicionar como inspiração
            </Button>
          )}
          <Button 
            size="sm" 
            color={colorScheme === "light" ? "dark" : "gray"}
            variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
            onClick={() => followUnfollow()}
          >
            {followedByMe?.following === 'true' ? 'Deixar de seguir' : 'Seguir'}
          </Button>
        </Stack>
      </Modal>
      <Modal 
        centered
        opened={modalBioOpen} 
        onClose={() => setModalBioOpen(false)} 
        title={'Sobre '+profile.name}
        scrollAreaComponent={ScrollArea.Autosize}
        fullScreen={isMobile ? true : false}
      >
        <Text size={'sm'}>{profile.bio}</Text>
        {profile.website && 
          <Anchor 
            href={profile.website} 
            target="_blank" 
            underline="hover" 
            style={{display:'block',width:'fit-content'}}
          >
            <Flex gap={2} align="center" mt={9}>
              <IconLink size={13} />
              <Text size={largeScreen ? "0.83em" : "0.82em"} fw={500}>
                {profile.website}
              </Text>
            </Flex>
          </Anchor>
        }
        {profile.phone && 
          <Text size="13px" mt={8}>
            Telefone: {profile.phone}
          </Text>
        }
      </Modal>
      <Modal 
        centered
        opened={modalContactOpen} 
        onClose={() => setModalContactOpen(false)} 
        title={'Entrar em contato com '+profile.name}
      >
        <Text size={'sm'}><strong>Localidade:</strong> {profile.city}, {profile.region}, {profile.country}</Text>
        <Text size={'sm'}><strong>E-mail:</strong> {profile.email}</Text>
        <Text size={'sm'}><strong>Celular:</strong> {profile.phone ? profile.phone : "Não informado"}</Text>
      </Modal>
      <Modal 
        centered
        opened={modalFollowersOpen}
        onClose={() => setModalFollowersOpen(false)}
        title={profile.followers.total+' seguidores'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.followers.result.map((follower, key) => 
          <Flex align={'center'} gap={7} mb={6} onClick={() => goToProfile(follower.username)} key={key}>
            <Avatar className='point' radius="xl" size="md" src={follower.picture ? follower.picture : undefined} />
            <Flex direction={'column'} className='point'>
              <Group gap={0}>
                <Text size='sm' fw={500}>
                  {follower.name} {follower.lastname}
                </Text>
                {follower.verified && 
                  <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                } 
              </Group>
              <Text size='xs'>
                {'@'+follower.username}
              </Text>
            </Flex>
          </Flex>
        )}
      </Modal>
      <Modal 
        centered
        opened={modalFollowingOpen}
        onClose={() => setModalFollowingOpen(false)}
        title={'Seguindo '+profile.following.total}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.following.result.map((following, key) => 
          <Flex key={key} align={'center'} gap={7} mb={6} onClick={() => goToProfile(following.username)}>
            <Avatar className='point' radius="xl" size="md" src={following.picture ? following.picture : undefined} />
            <Flex direction={'column'} className='point'>
              <Text size='sm' fw={500}>{following.name} {following.lastname}</Text>
              <Text size='xs'>
                {'@'+following.username}
              </Text>
            </Flex>
          </Flex>
        )}
      </Modal>
      <Modal 
        opened={modalStrengthsOpen}
        onClose={() => setModalStrengthsOpen(false)}
        title={`Votar pontos fortes de ${profile.name} ${profile.lastname}`}
        centered
        // fullScreen
      >
        <Alert variant="light" mb={10} p={'xs'} color="gray">
          <Text size="xs">Vote apenas nas áreas que você realmente conhece de {profile.name}. Ajude a manter o Mublin uma comunidade com credibilidade :)</Text>
        </Alert>
        {strengths.map((strength,key) =>
          <div key={key}>
            <Radio
              my={5}
              id={'strengthsGroup_'+strength.id}
              color="violet"
              value={strength.id}
              checked={(strength.id === strengthVoted || myVotes.filter((x) => { return x.strengthId === strength.id}).length) ? true : false}
              onChange={() => {
                setStrengthVoted(strength.id);
                setStrengthVotedName(strength.title);
              }}
              disabled={myVotes.filter((x) => { return x.strengthId === strength.id}).length}
              label={
                <>
                  <Group gap={3}>
                    <i className={strength.icon+' fa-fw ml-1'}></i> {strength.title}
                    {!!myVotes.filter((x) => { return x.strengthId === strength.id}).length && 
                      <Button 
                        size="compact-xs" 
                        variant="filled" 
                        color="red"
                        fw="400"
                        onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)}
                        leftSection={<IconX size={14} />}
                      >
                        Retirar voto
                      </Button>
                    }
                  </Group>
                </>
              }
            />
          </div>
        )}
        <Group mt="xs" justify="flex-end" gap={8}>
          <Button variant='outline' color='violet' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button loading={!strengthsLoaded} color='violet' onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <Modal 
        opened={modalLegendOpen}
        onClose={() => setModalLegendOpen(false)}
        title={`Lenda da música`}
        centered
        size="xs"
      >
        <Center>
          <IconShieldCheckFilled 
            style={
              { color: '#DAA520', width: rem(45), height: rem(45), marginLeft: '5px' }
            } 
          />
        </Center>
        <Text size="sm" mt="lg">
          {`${profile.name} ${profile.lastname} possui o selo de 'Lenda da Música' pois é reconhecido por um grande número de pessoas como alguém relevante e que contribuiu no cenário musical`}
        </Text>
        <Text size="xs" mt="lg" c="dimmed">
          Este selo é atribuído pela equipe do Mublin baseado em critérios internos
        </Text>
      </Modal>
      {(!profile.requesting && profile.requested && !profile.success && !profile.id) && 
        <>
          <Title order={3} ta="center" mt={40}>
            Esta página não está disponível.
          </Title>
          <Text size="md" ta="center">
            O link em que você clicou pode não estar funcionando, ou a página pode ter sido removida.
          </Text>
        </>
      }
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;