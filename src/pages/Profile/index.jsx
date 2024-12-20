import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate, Link } from 'react-router-dom'
import { profileInfos } from '../../store/actions/profile'
import { followInfos } from '../../store/actions/follow'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Container, Flex, Grid, Space, Paper, Center, Stack, Title, Text, Anchor, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, Modal, Button, Radio, Badge, ScrollArea, Alert, Tooltip, Divider, ActionIcon, Accordion, Indicator, rem, em } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconStar, IconStarFilled, IconBrandInstagram, IconMail, IconChevronDown, IconLink, IconLockSquareRoundedFilled, IconX, IconPencil } from '@tabler/icons-react'
import Header from '../../components/header'
import FloaterHeader from './floaterHeader'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { useMediaQuery } from '@mantine/hooks'
import PartnersModule from './partners'
import CarouselProjects from './carouselProjects'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import AvailabilityInfo from './availabilityInfo';
import './styles.scss';

function ProfilePage () {

  let navigate = useNavigate()
  const params = useParams()
  const username = params?.username
  const loggedUser = JSON.parse(localStorage.getItem('user'))
  const user = useSelector(state => state.user)
  const profile = useSelector(state => state.profile)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
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
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '2px', cursor: "pointer" };

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
        <FloaterHeader profile={profile} scrollY={scroll.y} />
      }
      <Header
        page='profile'
        username={username}
        profileId={profile.id}
        showBackIcon={true}
      />
      {profile.id && 
        <Container size='lg' mb={isMobile ? 82 : 30} pt={isMobile ? 0 : 10} className='profilePage'>
          <Grid>
            <Grid.Col pr={22} span={{ base: 12, md: 12, lg: 4 }}>
              {profile.requesting && 
                <>
                  <Group justify='flex-start'>
                    <Skeleton height={84} circle />
                    <SimpleGrid cols={1} spacing='xs' verticalSpacing='xs'>
                      <Skeleton height={18} width={240} radius='xl' />
                      <Skeleton height={11} width={240} radius='xl' />
                      <Skeleton height={14} width={240} radius='xl' />
                    </SimpleGrid>
                  </Group>
                  <Skeleton height={15} width={420} mt={16} radius='xl' />
                  <Skeleton height={15} width={450} mt={5} mb={20} radius='xl' />
                </>
              }
              {!profile.requesting && 
                <Paper 
                  radius='md'
                  withBorder={false}
                  px='0'
                  py='0'
                  style={isMobile ? { backgroundColor: 'transparent' } : { backgroundColor: 'transparent' }}
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
                    />
                    <Box style={{overflow:'hidden'}}>
                      <Flex align={'baseline'} mt={0}>
                        <Title order={isMobile ? 4 : 3} fw={460}>
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
                      <Text size='13px' fw='400' c='dimmed' mt={5}>
                        {profile.city}{profile.region && `, ${profile.region}`}
                      </Text>
                      {profile.plan === 'Pro' && 
                        <Badge size='xs' variant='light' color='#DAA520' title='Usuário PRO'>
                          PRO
                        </Badge>
                      }
                    </Box>
                  </Flex>
                  <Group 
                    gap={12} 
                    mt={isMobile ? 12 : 16} 
                    mb={isMobile ? 9 : 10}
                  >
                    <Text 
                      className='point'
                      size='0.9rem'
                      fw='430'
                      onClick={() => setModalFollowersOpen(true)}
                      style={{lineHeight: 'normal'}}
                    >
                      {profile.followers.total} seguidores
                    </Text>
                    <Text 
                      className='point'
                      size={isLargeScreen ? '0.9rem' : '0.9rem'} 
                      fw='430'
                      onClick={() => setModalFollowingOpen(true)}
                      style={{lineHeight: 'normal'}}
                    >
                      {profile.following.total} seguindo
                    </Text>
                  </Group>
                  {(profile.bio && profile.bio !== 'null') && 
                    <Text 
                      size={isMobile ? 'sm' : '0.83em'}
                      mt={5} lineClamp={3}
                      onClick={isMobile ? () => setModalBioOpen(true) : undefined}
                      pr={isMobile ? 0 : 26}
                      style={{lineHeight:'1.24em'}}
                      className='op80'
                    >
                      {profile.bio}
                    </Text>
                  }
                  {profile.website && 
                    <Anchor 
                      href={profile.website} 
                      target="_blank" 
                      underline="hover" 
                      className='websiteLink'
                      mt={isMobile ? 10 : 9}
                      mb={6}
                    >
                      <Flex gap={2} align="center">
                        <IconLink size={13} />
                        <Text size={isMobile ? "0.83em" : "0.83em"}>
                          {profile.website}
                        </Text>
                      </Flex>
                    </Anchor>
                  }
                  <Flex gap={5} mt={14}>
                    {loggedUser.id !== profile.id ? (
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
                      leftSection={<IconMail size={14} />} 
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
                        mb={isLargeScreen ? 12 : 0} 
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
                          fz={isLargeScreen ? "15px" : "14px"} 
                          fw={500}
                        >
                          {profile.availabilityTitle}
                        </Text>
                      </Flex>
                      {isLargeScreen && 
                        <AvailabilityInfo />
                      }
                      {isMobile && 
                        <Accordion chevronPosition="left">
                          <Accordion.Item value="Exibir mais detalhes" style={{border:'0px'}}>
                            <Accordion.Control p={0} fz="sm"  withBorder={false}>
                              Exibir mais detalhes
                            </Accordion.Control>
                            <Accordion.Panel pb={12}>
                              <AvailabilityInfo />
                            </Accordion.Panel>
                          </Accordion.Item>
                        </Accordion>
                      }
                    </> 
                  }
                </Paper>
              }
              {(isMobile && profile.availabilityId) && 
                <Divider mb={2} mt={6} />
              }
              {(profile.plan === 'Pro' && profile.total) && 
                <PartnersModule loading={profile.requesting} partners={profile.partners} />
              }
              {(isMobile && !profile.availabilityId) && 
                <Space h='xs' />
              }
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
              <Paper
                radius='md'
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 18}
                py={isMobile ? 0 : 12}
                mb={20}
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className='mublinModule'
              >
                <Group justify='space-between' align='center' gap={8} mb={13}>
                  <Title fz='1.2rem' fw={490} className='op80'>Postagens</Title>
                  {(profile.id === loggedUser.id && !profile.requesting) && 
                    <Button 
                      size='xs'
                      radius='lg'
                      variant='light'
                      color={colorScheme === 'light' ? 'dark' : 'gray'}
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
                    profile.recentActivity.result.slice(0,2).map((activity, key) =>
                      <Box key={key}>
                        <Group gap={3} mb={6}>
                          <Avatar src={profile.picture} />
                          <Flex direction='column'>
                            <Text size='xs' fw={400}>{profile.name} {profile.lastname}</Text>
                            <Text size='xs' c='dimmed' title={activity.created_date}>
                              há {formatDistance(new Date(activity.created * 1000), new Date(), {locale:pt})}
                            </Text>
                          </Flex>
                        </Group>
                        <Text size='sm' className='op80'>
                          {activity.extraText}
                        </Text>
                      </Box>
                    )
                  ) : (
                    <Text size='sm' color='dimmed'>Nenhuma postagem até o momento</Text>
                  )
                )}
              </Paper>
              <Divider mb={18} className='showOnlyInMobile' />
              <Paper
                radius='md'
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 18}
                py={isMobile ? 0 : 12}
                mb={20}
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className="mublinModule"
              >
                <Group justify='space-between' align='center' gap={8} mb={15}>
                  <Title fz='1.2rem' fw={490} className='op80'>Pontos Fortes</Title>
                  {(profile.id !== loggedUser.id && !profile.requesting) && 
                    <Button 
                      size='xs'
                      radius='lg'
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
                  <Box mb={20}>
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
                              className="carousel-strengths"
                            >
                              <i className={strength.icon}></i>
                              <Text fw={500} mb={2} mt={3} size='sm' align='center'>
                                {strength.strengthTitle}
                              </Text>
                              <Text size='11px'>
                                {strength.totalVotes + (strength.totalVotes > 1 ? ' votos' : ' voto')}
                              </Text>
                            </Flex>
                          </SplideSlide>
                        )}
                      </Splide>
                    ) : (
                      <Text size='xs'>
                        Nenhum ponto forte votado para {profile.name} até o momento
                      </Text>
                    )}
                  </Box>
                )}
              </Paper>
              <Divider mb={18} className='showOnlyInMobile' />
              <Paper 
                radius='md'
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 18}
                py={isMobile ? 0 : 12}
                mb={20}
                style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                className='mublinModule'
              >
                <Group justify='space-between' align='center' gap={8} mb={15}>
                  <Title fz='1.2rem' fw={490} className='op80'>
                    Projetos ({profile?.projects?.length})
                  </Title>
                  {(profile.id === loggedUser.id && !profile.requesting && profile.plan === "Free") && 
                    <Text 
                      size="sm"
                      c="dimmed"
                    >
                      Assine Mublin PRO e gerencie quantos projetos quiser!
                    </Text>
                  }
                </Group>
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
              <Divider mb={18} className='showOnlyInMobile' />
              {profile.plan === 'Pro' ? ( 
                <>
                  <Title fz='1.2rem' fw={490} className='op80' mb={10}>Equipamento</Title>
                  <Paper 
                    radius='md'
                    withBorder={isLargeScreen ? true : false}
                    px={isMobile ? 0 : 18}
                    py={isMobile ? 0 : 12}
                    mb={20}
                    style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                    className='mublinModule'
                  >
                    {profile.requesting ? ( 
                      <Text size='sm'>Carregando...</Text>
                    ) : (
                      <>
                        {profile.gear[0]?.brandId && 
                          <Group gap={10} mb={14}>
                            <NativeSelect 
                              size={isLargeScreen ? "xs" : "sm"}
                              w={148}
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
                                size={isLargeScreen ? "xs" : "sm"}
                                w={148}
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
                            <Splide 
                              options={{
                                drag   : 'free',
                                snap: false,
                                perPage: isMobile ? 2 : 5,
                                autoWidth: true,
                                arrows: true,
                                gap: '22px',
                                dots: false,
                                pagination: false,
                              }}
                            >
                              {gearFiltered.map((product, key) =>
                              <SplideSlide key={key}>
                                <Flex 
                                  direction='column' 
                                  justify='flex-start' 
                                  align='center' 
                                  className='carousel-gear' 
                                >
                                  <Link to={{ pathname: `/gear/product/${product.productId}` }}>
                                    <Image 
                                      src={'https://ik.imagekit.io/mublin/products/tr:h-240,w-240,cm-pad_resize,bg-FFFFFF/'+product.pictureFilename} 
                                      w={120}
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
                        radius='md'
                        withBorder={isLargeScreen ? true : false}
                        px={isMobile ? 0 : 18}
                        py={isMobile ? 0 : 12}
                        mb={20}
                        style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                        className='mublinModule'
                      >
                        <Text size='sm'>
                          Torne-se PRO para liberar esta funcionalidade em seu perfil!
                        </Text>
                        <Anchor 
                          href={`https://buy.stripe.com/8wM03sfPadmmc4EaEE?client_reference_id=${profile.id}&prefilled_email=${profile.email}&utm_source=gear`} 
                          target='_blank'
                          underline='never'
                        >
                          <Text size='xs' c='violet'>
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
              <Text size={isLargeScreen ? "0.83em" : "0.82em"} fw={500}>
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
        <Text size='sm'><strong>Localidade:</strong> {profile.city}, {profile.region}, {profile.country}</Text>
        <Text size='sm'><strong>E-mail:</strong> {profile.email}</Text>
        <Text size='sm' mb='md'><strong>Celular:</strong> {profile.phone ? profile.phone : 'Não informado'}</Text>
        <AvailabilityInfo />
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
                {follower.legend_badge && 
                  <IconShieldCheckFilled style={iconLegendStyle} />
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
          <Flex align={'center'} gap={7} mb={6} onClick={() => goToProfile(following.username)} key={key}>
            <Avatar className='point' radius="xl" size="md" src={following.picture ? following.picture : undefined} />
            <Flex direction={'column'} className='point'>
              <Group gap={0}>
                <Text size='sm' fw={500}>
                  {following.name} {following.lastname}
                </Text>
                {following.verified && 
                  <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                }
                {following.legend_badge && 
                  <IconShieldCheckFilled style={iconLegendStyle} />
                }
              </Group>
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
        opened={modalLegendOpen}
        onClose={() => setModalLegendOpen(false)}
        title={`Lenda da música`}
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
          {`${profile.name} ${profile.lastname} possui o selo de 'Lenda da Música' pois é reconhecido por um grande número de pessoas como alguém relevante e que contribuiu no cenário musical`}
        </Text>
        <Text size='xs' mt='lg' c='dimmed'>
          Este selo é atribuído pela equipe do Mublin baseado em critérios internos
        </Text>
      </Modal>
      {(!profile.requesting && profile.requested && !profile.success && !profile.id) && 
        <>
          <Title order={3} ta='center' mt={40}>
            Esta página não está disponível.
          </Title>
          <Text size='md' ta='center'>
            O link em que você clicou pode não estar funcionando, ou a página pode ter sido removida.
          </Text>
        </>
      }
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;