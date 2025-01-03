import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { profileInfos } from '../../store/actions/profile'
import { followInfos } from '../../store/actions/follow'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Container, Flex, Grid, Space, Card, Paper, Center, Stack, Title, Text, Anchor, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, Modal, Button, Radio, Badge, ScrollArea, Alert, Tooltip, Divider, ActionIcon, Accordion, Indicator, rem, em } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconStar, IconStarFilled, IconBrandInstagram, IconChevronDown, IconLink, IconLockSquareRoundedFilled, IconX, IconPencil, IconPlus, IconMapPin } from '@tabler/icons-react'
import Header from '../../components/header'
import FloaterHeader from './floaterHeader'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { useMediaQuery } from '@mantine/hooks'
import PartnersModule from './partners'
import CarouselProjects from './carouselProjects'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'
import AvailabilityInfo from './availabilityInfo'
import FeedCard from '../Home/feedCard'
import RelatedProfiles from './relatedProfiles'
import './styles.scss'

function ProfilePage () {

  let navigate = useNavigate()
  const params = useParams()
  const username = params?.username

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id
  const loggedUsername = decoded.result.username

  const profile = useSelector(state => state.profile)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme()

  const truncateString = (input, maxLength) => input.length > maxLength ? `${input.substring(0, maxLength)}...` : input

  let dispatch = useDispatch()
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username))
    if (loggedUsername !== username) {
      dispatch(followInfos.checkProfileFollowing(username))
    }
    dispatch(profileInfos.getProfileAvailabilityItems(username))
    dispatch(profileInfos.getProfileFollowers(username))
    dispatch(profileInfos.getProfileFollowing(username))
    dispatch(profileInfos.getProfileRelatedUsers(username))
    dispatch(profileInfos.getProfilePosts(username))
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
          'Authorization': 'Bearer '+token
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

  document.title = !profile.success && !profile.id ? 'Mublin' : `${profile.name} ${profile.lastname} | Mublin`;

  const followedByMe = useSelector(state => state.followedByMe);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const iconVerifiedStyle = { width: rem(18), height: rem(18), marginLeft: '5px', cursor: 'pointer' };
  const iconLegendStyle = { color: '#DAA520', width: rem(18), height: rem(18), marginLeft: '2px', cursor: 'pointer' };

  // Projects
  const allProjects = profile.projects.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 });
  // const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 });
  // const portfolioProjects = profile.projects.filter((project) => { return project.portfolio === 1 && project.confirmed === 1 });

  // Badges
  const [modalVerifiedOpen, setModalVerifiedOpen] = useState(false);
  const [modalLegendOpen, setModalLegendOpen] = useState(false);

  // Gear
  const [gearSetup, setGearSetup] = useState('');
  const [gearCategorySelected, setGearCategorySelected] = useState('');

  // const selectSetup = (setupId) => {
  //   setGearCategorySelected('');
  //   setGearSetup(setupId);
  // }

  const gear = useSelector(state => state.profile.gear.list).filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 });

  const gearFiltered = gearSetup ? gear.filter((product) => { 
    return profile.gearSetups.products.find(x => x.id === product.productId && x.setupId === Number(gearSetup)) 
  }) : gear;

  // const gearTotal = gearFiltered.filter((product) => { return product.productId > 0 });

  // Modal User Picture
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false)
  // Modal Follow 
  const [modalFollowInfoOpen, setModalFollowInfoOpen] = useState(false);
  // Modal Contact
  const [modalContactOpen, setModalContactOpen] = useState(false);
  // Modal Followers
  const [modalFollowersOpen, setModalFollowersOpen] = useState(false);
  // Modal Following
  const [modalFollowingOpen, setModalFollowingOpen] = useState(false);
  // Modal Gear Item Detail
  const [modalGearItemOpen, setModalGearItemOpen] = useState(false);
  const [gearItemDetail, setGearItemDetail] = useState({});
  const openModalGearDetail = (data) => {
    setModalGearItemOpen(true)
    setGearItemDetail(data)
  };

  const followUnfollow = () => {
    setModalFollowInfoOpen(false);
    if (!followedByMe.following || followedByMe.following === 'false') {
      setLoadingFollow(true);
      fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
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
          'Authorization': 'Bearer ' + token
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
          'Authorization': 'Bearer ' + token
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

  const myVotes = profile.strengthsRaw.filter((x) => { return x.idUserFrom === loggedUserId})
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
          'Authorization': 'Bearer ' + token
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
            'Authorization': 'Bearer ' + token
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
      {(profile.id && !modalFollowersOpen && !modalFollowingOpen && !modalGearItemOpen) && 
        <FloaterHeader profile={profile} scrollY={scroll.y} />
      }
      <Header
        page='profile'
        username={username}
        profileId={profile.id}
        showBackIcon={true}
      />
      {profile.requesting && 
        <Container 
          size='lg' 
          mb={isMobile ? 82 : 30} 
          pt={isMobile ? 0 : 10} 
          className='profilePage'
        >
          <Group justify='flex-start'>
            <Skeleton height={84} circle />
            <SimpleGrid cols={1} spacing='xs' verticalSpacing='xs'>
              <Skeleton height={18} width={180} radius='xl' />
              <Skeleton height={11} width={180} radius='xl' />
              <Skeleton height={14} width={180} radius='xl' />
            </SimpleGrid>
          </Group>
          <Skeleton height={15} width={315} mt={16} radius='xl' />
          <Skeleton height={15} width={315} mt={5} mb={20} radius='xl' />
        </Container>
      }
      {profile.id && 
        <Container 
          size='lg' 
          mb={isMobile ? 82 : 30} 
          pt={isMobile ? 0 : 10} 
          className='profilePage'
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
              <Paper 
                radius='md'
                withBorder={false}
                px='0'
                py='0'
                style={{ backgroundColor: 'transparent' }}
              >
                <Flex
                  justify='flex-start'
                  align='center'
                  direction='row'
                  wrap='nowrap'
                  columnGap='xs'
                >
                  <Avatar
                    size='xl'
                    src={profile.picture}
                    onClick={() => setModalAvatarOpen(true)}
                  />
                  <Box style={{overflow:'hidden'}}>
                    <Flex align='baseline' mb={1}>
                      <Title fz='1.30rem' fw='600'>
                        {profile.name} {profile.lastname}
                      </Title>
                      {!!profile.verified && 
                        <Tooltip label='Usuário Verificado'>
                          <IconRosetteDiscountCheckFilled 
                            color='#7950f2' 
                            style={iconVerifiedStyle} 
                            onClick={() => setModalVerifiedOpen(true)}
                          />
                        </Tooltip>
                      }
                      {!!profile.legend && 
                        <Tooltip label='Lenda da Música'>
                          <IconShieldCheckFilled
                            style={iconLegendStyle}
                            onClick={() => setModalLegendOpen(true)}
                          />
                        </Tooltip>
                      }
                    </Flex>
                    <Splide 
                      options={{
                        drag   : 'free',
                        snap: false,
                        perPage: isMobile ? 3 : 3,
                        autoWidth: true,
                        arrows: false,
                        gap: '3px',
                        dots: false,
                        pagination: false,
                      }}
                      className='carousel-roles'
                    >
                      {profile.roles.map((role, key) =>
                        <SplideSlide className='carousel-item' key={key}>
                          <Flex gap={2}>
                            {role.icon && 
                              <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' className={colorScheme === "dark" ? "invertPngColor" : undefined} />
                            }
                            <Text size='13px' fw='400' mr={7}>
                              {role.name}
                            </Text>
                          </Flex>
                        </SplideSlide>
                      )}
                    </Splide>
                    {profile.plan === 'Pro' && 
                      <Badge radius='xs' mt='4' size='xs' variant='outline' color='gray' title='Usuário PRO'>
                        PRO
                      </Badge>
                    }
                  </Box>
                </Flex>
                <Group 
                  gap={12} 
                  mt={isMobile ? 10 : 15} 
                  mb={isMobile ? 9 : 10}
                >
                  <Text 
                    className='point'
                    size={isMobile ? '1.06rem' : '0.87rem'}
                    fw='600'
                    onClick={() => setModalFollowersOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {profile.followers.total} seguidores
                  </Text>
                  <Text 
                    className='point'
                    size={isMobile ? '1.06rem' : '0.87rem'}
                    fw='600'
                    onClick={() => setModalFollowingOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {profile.following.total} seguindo
                  </Text>
                </Group>
                {(profile.bio && profile.bio !== 'null') && 
                  <Text 
                    size={isMobile ? 'sm' : '0.83em'}
                    fw='400'
                    mt={5}
                    lineClamp={6}
                    pr={isMobile ? 0 : 26}
                    style={{lineHeight:'1.24em',whiteSpace:'pre-wrap'}}
                  >
                    {profile.bio}
                  </Text>
                }
                {profile.city && 
                  <Flex gap={2} align='center' mt={9}>
                    <IconMapPin size={13} style={{color:'#8d8d8d'}} />
                    <Text size={isMobile ? '0.92em' : '0.83em'} c='#8d8d8d' className='lhNormal'>
                      {profile.city}{profile.region && `, ${profile.region}`}{profile.country && `, ${profile.country}`}
                    </Text>
                  </Flex>
                }
                {profile.website && 
                  <Anchor 
                    href={profile.website} 
                    target='_blank'
                    underline='hover'
                    className='websiteLink'
                    mt={isMobile ? 4 : 4}
                    mb={isMobile ? 8 : 6}
                  >
                    <Flex gap={2} align='center'>
                      <IconLink size={13} />
                      <Text size={isMobile ? '0.92em' : '0.83em'} className='lhNormal'>
                        {truncateString(profile.website, 35)}
                      </Text>
                    </Flex>
                  </Anchor>
                }
                <Flex gap={5} mt={isMobile ? 17 : 20} mb={isMobile ? 14 : 20}>
                  {loggedUserId !== profile.id ? (
                    <Button 
                      size='xs'
                      fz='14px'
                      fw='500'
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
                      size='xs'
                      fz='0.84rem'
                      fw='470'
                      variant='light'
                      color={colorScheme === "light" ? "dark" : "gray"}
                      fullWidth={isMobile}
                      leftSection={<IconPencil size={14} />} 
                      onClick={() => navigate('/settings')}
                    >
                      Editar perfil
                    </Button>
                  )}
                  <Button 
                    size='xs'
                    fz='0.84rem'
                    fw='470'
                    variant='light'
                    color={colorScheme === "light" ? "dark" : "gray"}
                    fullWidth={isMobile}
                    onClick={() => setModalContactOpen(true)}
                  >
                    Contato
                  </Button>
                  {profile.instagram && 
                    <>
                      <ActionIcon 
                        size={isLargeScreen ? "30px" : "30"}
                        w={isLargeScreen ? "30px" : "30"}
                        variant='light'
                        color={colorScheme === "light" ? "dark" : "gray"}
                        component="a"
                        href={`https://instagram.com/${profile.instagram}`}
                        target='_blank'
                        title='Instagram'
                      >
                        <IconBrandInstagram style={{ width: '70%', height: '70%' }} stroke={1.5} />
                      </ActionIcon>
                    </>
                  }
                </Flex>
                {profile.availabilityId && 
                  <>
                    {/* <Divider mt='md' mb='xs' label='Disponibilidade:' labelPosition='left' /> */}
                    <Flex 
                      align='center'
                      justify='flex-start'
                      gap={6} 
                      mt='md'
                      mb={isMobile ? 0 : 12} 
                    >
                      <Indicator 
                        inline
                        processing={profile.availabilityId}
                        color={profile.availabilityColor}
                        size={11}
                        ml={5}
                        mr={7}
                      />
                      <Text 
                        fz='14.2px'
                        fw='490'
                        className='lhNormal'
                        pt='1px'
                      >
                        {profile.availabilityTitle}
                      </Text>
                    </Flex>
                    <AvailabilityInfo mt={18} screen='largeScreen' />
                    {isMobile && 
                      <Accordion chevronPosition="left">
                        <Accordion.Item value="Exibir preferências musicais e de trabalho" style={{border:'0px'}}>
                          <Accordion.Control p={0} fz='sm'>
                            Exibir preferências musicais e de trabalho
                          </Accordion.Control>
                          <Accordion.Panel pb={12}>
                            <AvailabilityInfo screen='mobile' mt={4} />
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    }
                  </>
                }
              </Paper>
              {profile.availabilityId && 
                <Divider mb={2} mt={6} className='showOnlyInMobile' />
              }
              {(profile.plan === 'Pro' && profile.total) && 
                <PartnersModule loading={profile.requesting} partners={profile.partners} />
              }
              {!profile.availabilityId && 
                <Space h='xs' className='showOnlyInMobile' />
              }
              <Box className='showOnlyInLargeScreen' pr='lg'>
                <RelatedProfiles relatedUsers={profile.relatedUsers?.result} />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
              <CarouselProjects 
                profile={profile}
                projects={allProjects}
                profilePlan={profile.plan}
              />
              <Divider mt={12} mb={15} className='showOnlyInMobile' />
              <Paper
                radius='md'
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 16}
                pt={isMobile ? 0 : 12}
                pb={isMobile ? 3 : 12}
                mt='12'
                mb='14'
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className="mublinModule"
              >
                <Group justify='space-between' align='center' gap={8} mb={profile.strengths.total ? 15 : 8}>
                  <Title fz='1.03rem' fw='640'>
                    Pontos Fortes
                  </Title>
                  {(profile.id !== loggedUserId && !profile.requesting) && 
                    <Button 
                      size='xs'
                      variant='light'
                      color={colorScheme === 'light' ? 'dark' : 'gray'}
                      onClick={() => setModalStrengthsOpen(true)}
                    >
                      Votar
                    </Button>
                  }
                </Group>
                {profile.requesting ? ( 
                  <Text size='sm'>Carregando...</Text>
                ) : (
                  <Box mb={5}>
                    {(profile.strengths.total && profile.strengths.result[0].idUserTo === profile.id) ? ( 
                      <Splide 
                        options={{
                          drag   : 'free',
                          snap: false,
                          perPage: isMobile ? 3 : 6,
                          autoWidth: true,
                          arrows: false,
                          gap: '22px',
                          dots: false,
                          pagination: false,
                        }}
                      >
                        {profile.strengths.result.map((strength, key) =>
                          <SplideSlide key={key}>
                            <Flex 
                              justify="flex-start"
                              align="center"
                              direction="column"
                              wrap="wrap"
                              gap={4}
                              className="carousel-strengths"
                            >
                              <i className={strength.icon}></i>
                              <Text fw='430' size='0.84rem' align='center'>
                                {strength.strengthTitle}
                              </Text>
                              <Text size='11px' fw='390' c='dimmed'>
                                {strength.totalVotes + (strength.totalVotes > 1 ? ' votos' : ' voto')}
                              </Text>
                            </Flex>
                          </SplideSlide>
                        )}
                      </Splide>
                    ) : (
                      <Text size='sm'>
                        Nenhum ponto forte votado para {profile.name} até o momento
                      </Text>
                    )}
                  </Box>
                )}
              </Paper>
              {profile.plan === 'Pro' ? ( 
                <>
                  <Divider mb={18} className='showOnlyInMobile' />
                  <Paper
                    radius='md'
                    withBorder={isLargeScreen ? true : false}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={(isLargeScreen && profile.gear.total > 5) ? 34 : 12}
                    mb={14}
                    style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                    className='mublinModule'
                  >
                    <Group justify='space-between' align='center' gap={8} mb={13}>
                      <Title fz='1.03rem' fw='640'>
                        Equipamento {!!profile.gear.total && `(${profile.gear.total})`}
                      </Title>
                      {(profile.id === loggedUserId && !profile.requesting) && 
                        <Button 
                          size='xs'
                          variant='light'
                          color={colorScheme === 'light' ? 'dark' : 'gray'}
                          // leftSection={<IconSettings size={14} />}
                          component='a'
                          href='/settings/my-gear'
                        >
                          Gerenciar
                        </Button>
                      }
                    </Group>
                    {profile.requesting ? ( 
                      <Text size='sm'>Carregando...</Text>
                    ) : (
                      <>
                        {!!profile.gear.total && 
                          <Group gap={10} mb={14}>
                            {/* <NativeSelect 
                              // description='Setups'
                              size='sm'
                              w={155}
                              // onChange={(e) => setGearSetup(e.target.options[e.target.selectedIndex].value)}
                              onChange={(e) => selectSetup(e.target.options[e.target.selectedIndex].value)}
                            >
                              <option value="">Setup completo</option>
                              {profile.gearSetups.total && profile.gearSetups.setups.map((setup, key) =>
                                <option key={key} value={setup.id}>
                                  {setup.name}
                                </option>
                              )}
                            </NativeSelect> */}
                            {!gearSetup && 
                              <NativeSelect
                                // description='Tipo de equipamento'
                                size='sm'
                                w={145}
                                onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value="">
                                  Exibir tudo
                                </option>
                                {profile.gearCategories.list.map((gearCategory, key) =>
                                  <option key={key} value={gearCategory.category}>
                                    {truncate(gearCategory.category) + '(' + gearCategory.total + ')'}
                                  </option>
                                )}
                              </NativeSelect>
                            }
                          </Group>
                        }
                        {profile.gear.total ? ( 
                          <>
                            <Splide 
                              options={{
                                drag: 'free',
                                snap: false,
                                perPage: isMobile ? 2 : 5,
                                autoWidth: true,
                                arrows: false,
                                gap: '22px',
                                dots: true,
                                pagination: true,
                              }}
                            >
                              {gearFiltered.map(product =>
                                <SplideSlide key={product.productId}>
                                  <Flex
                                    direction='column'
                                    justify='flex-start'
                                    align='center'
                                    className='carousel-gear'
                                  >
                                    <Image
                                      src={'https://ik.imagekit.io/mublin/products/tr:w-240,h-240,cm-pad_resize,bg-FFFFFF,fo-x/'+product.pictureFilename}
                                      h={120}
                                      mah={120}
                                      w='auto'
                                      fit='contain'
                                      mb={10}
                                      radius='md'
                                      onClick={() => openModalGearDetail(product)}
                                      className='point'
                                    />
                                    {/* <Image 
                                      src={'https://ik.imagekit.io/mublin/tr:h-300,cm-pad_resize,bg-FFFFFF/products/'+picture}
                                      height='205' 
                                      ml='10' 
                                    /> */}
                                    <Box w={110}>
                                      <Text size='11px' fw={550} mb={3} truncate='end' title={product.brandName}>
                                        {product.brandName}
                                      </Text>
                                      <Text size='sm' truncate='end' title={product.productName}>
                                        {product.productName}
                                      </Text>
                                    </Box>
                                    {product.tuning && 
                                      <Group gap={2} mt={4} mb='2'>
                                        <Text
                                          size='9px'
                                          fw='450'
                                          c='dimmed'
                                        >
                                          Afinação: {product.tuning}
                                        </Text>
                                      </Group>
                                    }
                                    {!!product.forSale && 
                                      <Flex direction='column' align='center' gap={4} mt={4}>
                                        <Badge size='xs' color='dark'>À venda</Badge>
                                        {!!product.price && 
                                          <Text size='10px' fw={500}>
                                            {product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                                          </Text>
                                        }
                                      </Flex>
                                    }
                                  </Flex>
                                </SplideSlide>
                              )}
                            </Splide>
                          </>
                        ) : (
                          <Text size='sm' c='dimmed'>Nenhum equipamento cadastrado</Text>
                        )}
                      </>
                    )}
                  </Paper>
                </>
              ) : (
                <>
                  {loggedUserId === profile.id && 
                    <Paper
                      radius='md'
                      withBorder={isLargeScreen ? true : false}
                      px={isMobile ? 0 : 16}
                      pt={isMobile ? 0 : 12}
                      pb={(isLargeScreen && profile.gear.total > 5) ? 34 : 12}
                      mb={8}
                      style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                      className='mublinModule'
                    >
                      <Divider mb={18} className='showOnlyInMobile' />
                      <Group gap={3} mb={8}>
                        <Title fz='1.03rem' fw='640'>
                          Equipamento
                        </Title>
                        <IconLockSquareRoundedFilled size={22} color="gray" /> 
                      </Group>
                      <Text size='sm'>
                        Torne-se PRO para habilitar esta funcionalidade em seu perfil!
                      </Text>
                      <Anchor
                        variant='gradient'
                        gradient={{ from: 'violet', to: 'blue' }}
                        fw='440'
                        fz='sm'
                        underline='hover'
                        href={`https://buy.stripe.com/eVaeYmgTefuu8SsfYZ?client_reference_id=${profile.id}&prefilled_email=${profile.email}&utm_source=profileGearSection`} 
                        target='_blank'
                      >
                        Assinar Mublin PRO - R$ 29,90 por 3 meses
                      </Anchor>
                    </Paper>
                  }
                </>
              )}
              <Divider mb={16} className='showOnlyInMobile' />
              <Paper
                radius='md'
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 16}
                py={isMobile ? 0 : 12}
                mb={20}
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className='mublinModule'
              >
                <Group justify='space-between' align='center' gap={8} mb={13}>
                  <Title fz='1.03rem' fw='640'>Postagens</Title>
                  {(profile.id === loggedUserId && !profile.requesting) && 
                    <Button 
                      size='xs'
                      variant='light'
                      color={colorScheme === 'light' ? 'dark' : 'gray'}
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setModalStrengthsOpen(true)}
                    >
                      Nova postagem
                    </Button>
                  }
                </Group>
                {profile.requesting ? ( 
                  <Text size='sm'>Carregando...</Text>
                ) : (
                  profile.recentActivity.total ? (
                    <Grid>
                      {profile.recentActivity.result.slice(0, 2).map(activity =>
                        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                          <Box style={{height: (activity.image || activity.videoUrl) ? '180px' :  '120px'}} key={activity.id}>
                            <FeedCard
                              item={activity}
                              compact
                            />
                          </Box>
                        </Grid.Col>
                      )}
                    </Grid>
                  ) : (
                    <Text size='sm' c='dimmed'>Nenhuma postagem até o momento</Text>
                  )
                )}
                {profile.recentActivity.total > 2 && 
                  <Text size='sm' className='op80 point' ta='center' mt='14' fw='460'>
                    Ver mais postagens
                  </Text>
                }
              </Paper>
              <Box className='showOnlyInMobile' pr='lg'>
                <RelatedProfiles relatedUsers={profile.relatedUsers?.result} />
              </Box>
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
              size='md'
              src={profile.picture}
            />
            <Flex direction='column'>
              <Text size='sm' fw='620'>
                {`${profile.name} ${profile.lastname}`}
              </Text>
              <Text size='xs' c='dimmed'>
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
              size='sm' 
              color={colorScheme === 'light' ? 'dark' : 'gray'}
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
        opened={modalContactOpen} 
        onClose={() => setModalContactOpen(false)} 
        title={'Entrar em contato com '+profile.name}
      >
        <Text size='sm'><strong>Localidade:</strong> {profile.city}, {profile.region}, {profile.country}</Text>
        <Text size='sm'><strong>E-mail:</strong> {profile.email}</Text>
        <Text size='sm' mb='md'><strong>Celular:</strong> {profile.phone ? profile.phone : 'Não informado'}</Text>
      </Modal>
      <Modal 
        centered
        fullScreen={isMobile ? true : false}
        opened={modalFollowersOpen}
        onClose={() => setModalFollowersOpen(false)}
        title={profile.followers.total+' seguidores'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.followers.total ?  (
          profile.followers.result.map(follower => 
            <Flex align={'center'} gap={7} mb={17} onClick={() => goToProfile(follower.username)} key={follower.id}>
              <Avatar className='point' radius="xl" size="md" src={follower.picture ? follower.picture : undefined} />
              <Flex direction={'column'} className='point'>
                <Group gap={0}>
                  <Text size='md' fw={420} style={{lineHeight:'normal'}}>
                    {follower.name} {follower.lastname}
                  </Text>
                  {follower.verified && 
                    <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} />
                  }
                  {follower.legend_badge && 
                    <IconShieldCheckFilled style={iconLegendStyle} />
                  }
                </Group>
                <Text size='xs'>
                  {'@'+follower.username}
                </Text>
              </Flex>
            </Flex>
          )
        ) : (
          <Text size='sm'>{profile.name} não é seguido por ninguém no momento</Text>
        )}
      </Modal>
      <Modal 
        centered
        fullScreen={isMobile ? true : false}
        opened={modalFollowingOpen}
        onClose={() => setModalFollowingOpen(false)}
        title={'Seguindo '+profile.following.total}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.following.total ?  (
          profile.following.result.map(following => 
            <Flex align={'center'} gap={7} mb={17} onClick={() => goToProfile(following.username)} key={following.id}>
              <Avatar className='point' radius="xl" size="md" src={following.picture ? following.picture : undefined} />
              <Flex direction={'column'} className='point'>
                <Group gap={0}>
                  <Text size='md' fw={420} style={{lineHeight:'normal'}}>
                    {following.name} {following.lastname}
                  </Text>
                  {following.verified && 
                    <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} />
                  }
                  {following.legend_badge && 
                    <IconShieldCheckFilled style={iconLegendStyle} />
                  }
                </Group>
                <Text size='xs' color='dimmed'>
                  {'@'+following.username}
                </Text>
              </Flex>
            </Flex>
          )
        ) : (
          <Text size='sm'>{profile.name} não segue ninguém no momento</Text>
        )}
      </Modal>
      <Modal 
        opened={modalStrengthsOpen}
        onClose={() => setModalStrengthsOpen(false)}
        title={`Votar pontos fortes de ${profile.name} ${profile.lastname}`}
        centered
        fullScreen={isMobile ? true : false}
      >
        <Alert variant='light' mb={10} p='xs' color='gray'>
          <Text size='xs'>Vote apenas nas áreas que você realmente conhece de {profile.name}. Ajude a manter o Mublin uma comunidade com credibilidade :)</Text>
        </Alert>
        {strengths.map((strength,key) =>
          <div key={key}>
            <Radio
              my={5}
              id={'strengthsGroup_'+strength.id}
              color='violet'
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
                        size='compact-xs'
                        variant='filled'
                        color='red'
                        fw='400'
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
        <Group mt='xs' justify='flex-end' gap={8}>
          <Button variant='outline' color='violet' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button loading={!strengthsLoaded} color='violet' onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <Modal 
        opened={modalVerifiedOpen}
        onClose={() => setModalVerifiedOpen(false)}
        title='Usuário verificado'
        centered
        size='xs'
      >
        <Center>
          <IconRosetteDiscountCheckFilled 
            style={
              { color: '#7950f2', width: rem(45), height: rem(45), marginLeft: '5px' }
            }
          />
        </Center>
        <Text size='sm' mt='lg'>
          {`${profile.name} ${profile.lastname} possui o selo de usuário verificado pois teve a identidade reconhecida nesta plataforma`}
        </Text>
        <Text size='xs' mt='lg' c='dimmed'>
          Este selo é atribuído pela equipe do Mublin baseado em critérios internos. A aquisição do <nobr>Mublin PRO</nobr> garante mais agilidade na atribuição do selo de verificação.
        </Text>
      </Modal>
      <Modal 
        opened={modalLegendOpen}
        onClose={() => setModalLegendOpen(false)}
        title='Lenda da Música'
        centered
        size='xs'
      >
        <Center>
          <IconShieldCheckFilled 
            style={
              { color: '#DAA520', width: rem(45), height: rem(45), marginLeft: '5px' }
            } 
          />
        </Center>
        <Text size='sm' mt='lg'>
          {`${profile.name} ${profile.lastname} possui o selo de 'Lenda da Música' pois é reconhecido por um grande número de pessoas como alguém relevante e que com grande contribuição no cenário musical`}
        </Text>
        <Text size='xs' mt='lg' c='dimmed'>
          Este selo é atribuído pela equipe do Mublin baseado em critérios internos
        </Text>
      </Modal>
      <Modal 
        opened={modalAvatarOpen}
        onClose={() => setModalAvatarOpen(false)}
        withCloseButton={false}
        centered
        size='lg'
        overlayProps={{
          backgroundOpacity: 0.7,
          blur: 4,
        }}
        className='modalAvatarExpanded'
      >
        <Center onClick={() => setModalAvatarOpen(false)}>
          <Avatar w={200} h={200} src={profile.picture ? profile.picture : undefined} />
        </Center>
      </Modal>
      <Modal 
        opened={modalGearItemOpen}
        onClose={() => setModalGearItemOpen(false)}
        centered
        title={
          <Flex direction='column'>
            <Text size='md' fw='500'>
              {gearItemDetail.brandName} {gearItemDetail.productName}
            </Text>
            <Text size='xs' c='dimmed'>
              Faz parte do equipamento de {profile.name}
            </Text>
          </Flex>
        }
        withCloseButton
        size='md'
      >
        <Center mt='md'>
          <Image 
            src={'https://ik.imagekit.io/mublin/products/tr:w-310,h-240,cm-pad_resize,bg-FFFFFF,fo-x/'+gearItemDetail.pictureFilename}
            h={240}
            mah={240}
            w='auto'
            fit='contain'
            mb='10'
            radius='md'
          />
        </Center>
        {gearItemDetail.tuning && 
          <Box>
            <Text ta='center' size='xs' fw='380'>Afinação: {gearItemDetail.tuning}</Text>
            <Text ta='center' size='xs' c='dimmed'>{gearItemDetail.tuningDescription}</Text>
          </Box>
        }
        {!!gearItemDetail.forSale && 
          <Flex align='center' justify='center' gap='4' mt='4'>
            <Badge size='md' color='dark'>À venda</Badge>
            {!!gearItemDetail.price && 
              <Text size='xs' fw='450'>
                {gearItemDetail.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
              </Text>
            }
          </Flex>
        }
        {gearItemDetail.ownerComments && 
          <Card className='mublinModule' px='10' py='10' mt='xs'>
            <ScrollArea h='72' type='auto'>
              <Text size='sm'>{gearItemDetail.ownerComments}</Text>
            </ScrollArea>
          </Card>
        }
        <Button 
          size='sm'
          color='violet'
          variant='transparent'
          fullWidth
          fw='440'
          component='a'
          href={`/gear/product/${gearItemDetail.productId}`}
        >
          Ver mais detalhes do produto
        </Button>
      </Modal>
      {(!profile.requesting && profile.requested && !profile.success && !profile.id) && 
        <>
          <Title order={4} fw='490' ta='center' mt='40' mb='10'>
            Esta página não está disponível.
          </Title>
          <Text size='md' ta='center' px='16'>
            O link em que você clicou pode não estar funcionando, ou a página pode ter sido removida.
          </Text>
        </>
      }
      <FooterMenuMobile
        hide={
          modalAvatarOpen || modalFollowersOpen || modalFollowingOpen || modalStrengthsOpen || modalGearItemOpen || modalVerifiedOpen || modalLegendOpen
        }
      />
    </>
  );
};

export default ProfilePage;