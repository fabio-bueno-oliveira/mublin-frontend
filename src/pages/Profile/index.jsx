import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { profileInfos } from '../../store/actions/profile'
import { followInfos } from '../../store/actions/follow'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Container, Flex, Grid, Space, Paper, Card, Center, Stack, Title, Text, Anchor, Group, Avatar, Box, Skeleton, SimpleGrid, Modal, Button, Radio, Badge, ScrollArea, Alert, Image, Tooltip, Divider, ActionIcon, Accordion, Indicator, Table, rem, em } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled,IconBrandInstagram, IconBrandTiktok, IconChevronDown, IconLink, IconLockSquareRoundedFilled, IconPlus, IconMapPin, IconEye, IconPiano } from '@tabler/icons-react'
import Header from '../../components/header'
import FloaterHeader from './floaterHeader'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { useMediaQuery } from '@mantine/hooks'
import PartnersModule from './partners'
import Projects from './Projects'
import GearSection from './Gear/gearSection'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'
import AvailabilityInfo from './availabilityInfo'
import FeedCard from '../Home/feedCard'
import RelatedProfiles from './relatedProfiles'
import NewPost from '../../pages/New/postStandalone'
import { truncateString, nFormatter } from '../../utils/formatter'
import './styles.scss'

function ProfilePage () {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const params = useParams()
  const username = params?.username

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id
  const loggedUsername = decoded.result.username

  const user = useSelector(state => state.user)
  const profile = useSelector(state => state.profile)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme()

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

  // Projects
  const allProjects = profile.projects.result.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 });
  // const mainProjects = profile.projects.result.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 });
  // const portfolioProjects = profile.projects.result.filter((project) => { return project.portfolio === 1 && project.confirmed === 1 });

  // Modal Badges
  const [modalVerifiedOpen, setModalVerifiedOpen] = useState(false)
  const [modalLegendOpen, setModalLegendOpen] = useState(false)
  // Modal User Picture
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false)
  // Modal Follow
  const [modalFollowInfoOpen, setModalFollowInfoOpen] = useState(false)
  // Modal Contact
  const [modalContactOpen, setModalContactOpen] = useState(false)
  // Modal Followers
  const [modalFollowersOpen, setModalFollowersOpen] = useState(false)
  // Modal Following
  const [modalFollowingOpen, setModalFollowingOpen] = useState(false)
  // Modal Profile Feed
  const [modalProfileFeedOpen, setModalProfileFeedOpen] = useState(false)

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

  // const changeInspirationStatus = (id, followedId, option) => {
  //   fetch('https://mublin.herokuapp.com/profile/'+profile.username+'/updateInspiration', {
  //     method: 'PUT',
  //     headers: {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token
  //     },
  //     body: JSON.stringify({id: id, followedId: followedId, option: option})
  //       }).then((response) => {
  //         response.json().then((response) => {
  //           dispatch(followInfos.checkProfileFollowing(username));
  //         })
  //       }).catch(err => {
  //         console.error(err)
  //       })
  // }

  const goToProfile = (username) => {
    setModalFollowersOpen(false);
    setModalFollowingOpen(false);
    navigate('/'+username);
  }

  // Strentgth
  const [modalStrengthsOpen, setModalStrengthsOpen] = useState(false)
  const [modalStrengthVotesOpen, setModalStrengthVotesOpen] = useState(false)
  const openVotesHistoryModal = () => {
    if (user.plan === 'Pro') {
      dispatch(profileInfos.getProfileStrengthsVotesHistory(username))
    }
    setModalStrengthVotesOpen(true)
  }

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

  // Modal New Post
  const [showModalNewPost, setShowModalNewPost] = useState(false)

  const [scroll] = useWindowScroll();

  return (
    <>
      {(profile.id && !modalFollowersOpen && !modalFollowingOpen && !modalProfileFeedOpen) && 
        <FloaterHeader profile={profile} scrollY={scroll.y} />
      }
      <Header
        page='profile'
        reloadUserInfo
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
              <Card
                radius='lg'
                // mt={12}
                mb={10}
                withBorder={isLargeScreen ? true : false}
                px={16}
                pt={12}
                pb={12}
                className="mublinModule transparentBgInMobile"
                visibleFrom="md"
              >
                <Card.Section>
                  <Image
                    src={profile.pictureCover ? `https://ik.imagekit.io/mublin/tr:h-200,c-maintain_ratio/users/avatars/${profile.id}/${profile.pictureCover}` : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'} 
                    height={100}
                    alt={`Imagem de capa de ${profile.name}`}
                  />
                </Card.Section>
                <Group justify={isMobile ? 'center' : 'flex-start'} style={{marginTop:'-50px'}}>
                  <Indicator 
                    position='bottom-center' 
                    inline 
                    label={<Text size='0.6rem' >{profile.openToWorkText}</Text>} 
                    color='lime' 
                    size={18} 
                    withBorder 
                    // disabled={!profile.openToWork}
                    disabled={true}
                  >
                    <Avatar
                      size='xl'
                      // radius='md'
                      src={profile.picture ? profile.picture : undefined}
                      style={{border:'3px solid white'}}
                      onClick={() => setModalAvatarOpen(true)}
                    />
                  </Indicator>
                </Group>
                <Flex justify='flex-start' align='baseline' mt={16}>
                  <Title fz='1.34rem' fw='600' style={{lineHeight:'0.6'}}>
                    {profile.name} {profile.lastname}
                  </Title>
                  {!!profile.verified && 
                    <Tooltip label='Usuário verificado'>
                      <IconRosetteDiscountCheckFilled 
                        className='iconVerified'
                        onClick={() => setModalVerifiedOpen(true)}
                      />
                    </Tooltip>
                  }
                  {!!profile.legend && 
                    <Tooltip label='Lenda da Música'>
                      <IconShieldCheckFilled
                        className='iconLegend'
                        onClick={() => setModalLegendOpen(true)}
                      />
                    </Tooltip>
                  }
                  {profile.plan === 'Pro' && 
                    <Tooltip label='Mublin PRO'>
                      <IconPiano className='iconMublinPiano' />
                    </Tooltip>
                  }
                </Flex>
                <Flex gap={0} mt={4} opacity={0.8} wrap='wrap'>
                  {profile.roles.map((role, key) => 
                    <Flex key={key} gap={2} align='center'>
                      {role.icon && 
                        <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' className={colorScheme === "dark" ? "invertPngColor" : undefined} style={key > 0 ? {marginLeft:'4px'} : undefined} />
                      }
                      <Text fw={400} size='xs' mr={1}>
                        {role.description}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                <Group
                  gap={12}
                  mt={5}
                  mb={8}
                >
                  <Text 
                    className='point'
                    size='0.85rem'
                    fw='500'
                    onClick={() => setModalFollowersOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {nFormatter(profile.followers.total)} seguidores
                  </Text>
                  <Text 
                    className='point'
                    size='0.85rem'
                    fw='500'
                    onClick={() => setModalFollowingOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {nFormatter(profile.following.total)} seguindo
                  </Text>
                </Group>
                {profile.city && 
                  <Flex gap={2} align='center' mb={6}>
                    <IconMapPin size={13} style={{color:'#8d8d8d'}} />
                    <Text size={isMobile ? '0.91em' : '0.83em'} c='#8d8d8d' className='lhNormal'>
                      {profile.city}{profile.region && `, ${profile.region}`}{profile.country && `, ${profile.country}`}
                    </Text>
                  </Flex>
                }
                {(profile.bio && profile.bio !== 'null') && 
                  <Text
                    size='0.83em'
                    fw='400'
                    mb={8}
                    lineClamp={6}
                    pr={26}
                    style={{lineHeight:'1.24em',whiteSpace:'pre-wrap'}}
                  >
                    {profile.bio}
                  </Text>
                }
                <Box id='social'>
                  {profile.website && 
                    <Anchor 
                      href={profile.website} 
                      target='_blank'
                      underline='hover'
                      className='websiteLink'
                    >
                      <Flex gap={2} align='center'>
                        <IconLink size={13} />
                        <Text size={isMobile ? '0.91em' : '0.83em'} className='lhNormal'>
                          {truncateString(profile.website, 37)}
                        </Text>
                      </Flex>
                    </Anchor>
                  }
                  {(profile.instagram || profile.tiktok) &&
                    <Group gap={6} mt={6}>
                      {profile.instagram &&
                        <Anchor 
                          href={`https://instagram.com/${profile.instagram}`}
                          target='_blank'
                          underline='hover'
                          className='websiteLink'
                        >
                          <Flex gap={2} align='center'>
                            <IconBrandInstagram size={13} />
                            <Text size='0.83em' className='lhNormal'>
                              Instagram
                            </Text>
                          </Flex>
                        </Anchor>
                      }
                      {profile.tiktok &&
                        <Anchor 
                          href={`https://tiktok.com/@${profile.tiktok}`}
                          target='_blank'
                          underline='hover'
                          className='websiteLink'
                        >
                          <Flex gap={2} align='center'>
                            <IconBrandTiktok size={13} />
                            <Text size='0.83em' className='lhNormal'>
                              TikTok
                            </Text>
                          </Flex>
                        </Anchor>
                      }
                    </Group>
                  }
                </Box>
                {profile.plan === 'Pro' && 
                  <Card.Section mt={12}>
                    <Divider />
                    <Group align='center' gap={4} pt={8} pb={14} px={15}>
                      <Badge 
                        radius='sm' 
                        size='sm' 
                        color='secondary' 
                        variant="gradient"
                        gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                      >
                        PRO
                      </Badge>
                      <Text c='#969168' className='lhNormal' size='xs'>
                        Perfil otimizado com Mublin PRO
                      </Text>
                    </Group>
                  </Card.Section>
                }
              </Card>
              <Paper 
                withBorder={false}
                px='0'
                py='0'
                style={{ backgroundColor: 'transparent' }}
                hiddenFrom="sm"
              >
                <Flex
                  justify='flex-start'
                  align='center'
                  direction='row'
                  wrap='nowrap'
                  columnGap='xs'
                >
                  <Indicator position='bottom-center' inline label={<Text size='0.6rem' >{profile.openToWorkText}</Text>} color='lime' size={18} withBorder disabled={!profile.openToWork}>
                    <Avatar
                      size='xl'
                      src={profile.picture}
                      onClick={() => setModalAvatarOpen(true)}
                    />
                  </Indicator>
                  <Box style={{overflow:'hidden'}}>
                    <Flex align='baseline' mb={1}>
                      <Title fz='1.30rem' fw='600'>
                        {profile.name} {profile.lastname}
                      </Title>
                      {!!profile.verified && 
                        <IconRosetteDiscountCheckFilled 
                          className='iconVerified'
                          title='Usuário verificado'
                          onClick={() => setModalVerifiedOpen(true)}
                        />
                      }
                      {!!profile.legend && 
                        <IconShieldCheckFilled
                          className='iconLegend'
                          title='Lenda da Música'
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
                              {role.description}
                            </Text>
                          </Flex>
                        </SplideSlide>
                      )}
                    </Splide>
                    {profile.plan === 'Pro' && 
                      <Badge
                        mt='4'
                        title='Usuário PRO'
                        radius='sm'
                        size='sm'
                        variant="gradient"
                        gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                      >
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
                    size={isMobile ? '1.04rem' : '0.87rem'}
                    fw='600'
                    onClick={() => setModalFollowersOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {profile.followers.total} seguidores
                  </Text>
                  <Text 
                    className='point'
                    size={isMobile ? '1.04rem' : '0.87rem'}
                    fw='600'
                    onClick={() => setModalFollowingOpen(true)}
                    style={{lineHeight: 'normal'}}
                  >
                    {profile.following.total} seguindo
                  </Text>
                </Group>
                {(profile.bio && profile.bio !== 'null') && 
                  <Text 
                    size={isMobile ? '0.92em' : '0.83em'}
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
                    <Text size={isMobile ? '0.91em' : '0.83em'} c='#8d8d8d' className='lhNormal'>
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
                      <Text size={isMobile ? '0.91em' : '0.83em'} className='lhNormal'>
                        {truncateString(profile.website, 37)}
                      </Text>
                    </Flex>
                  </Anchor>
                }
                {(profile.instagram || profile.tiktok) &&
                  <Group gap={10} mt={6}>
                    {profile.instagram &&
                      <Anchor 
                        href={`https://instagram.com/${profile.instagram}`}
                        target='_blank'
                        underline='hover'
                        className='websiteLink'
                      >
                        <Flex gap={2} align='center'>
                          <IconBrandInstagram size={13} />
                          <Text size='0.83em' className='lhNormal'>
                            Instagram
                          </Text>
                        </Flex>
                      </Anchor>
                    }
                    {profile.tiktok &&
                      <Anchor 
                        href={`https://tiktok.com/@${profile.tiktok}`}
                        target='_blank'
                        underline='hover'
                        className='websiteLink'
                      >
                        <Flex gap={2} align='center'>
                          <IconBrandTiktok size={13} />
                          <Text size='0.83em' className='lhNormal'>
                            TikTok
                          </Text>
                        </Flex>
                      </Anchor>
                    }
                  </Group>
                }
              </Paper>
              <Flex gap={5} mt={17} mb={isMobile ? 14 : 20}>
                {loggedUserId !== profile.id ? (
                  <>
                    {followedByMe?.following === 'true' ? (
                      <Button 
                        size='sm'
                        fz='0.85rem'
                        fw='570'
                        h={30}
                        color='primary'
                        variant='outline'
                        loading={loadingFollow}
                        rightSection={<IconChevronDown size={14} />}
                        fullWidth={isMobile}
                        onClick={() => setModalFollowInfoOpen(true)}
                      >
                        Seguindo
                      </Button>
                    ) : (
                      <Button 
                        size='sm'
                        fz='0.85rem'
                        fw='570'
                        h={30}
                        color='mublinColor'
                        variant='filled'
                        loading={loadingFollow}
                        fullWidth={isMobile}
                        onClick={() => followUnfollow()}
                      >
                        Seguir
                      </Button>
                    )}
                    <Button 
                      size='sm'
                      fz='0.85rem'
                      fw='570'
                      h={30}
                      variant='outline'
                      color='primary'
                      fullWidth={isMobile}
                      onClick={() => setModalContactOpen(true)}
                    >
                      Contato
                    </Button>
                  </>
                ) : (
                  <Button
                    size='sm'
                    fz='0.85rem'
                    fw='570'
                    h={30}
                    variant='outline'
                    color='primary'
                    fullWidth={isMobile}
                    onClick={() => navigate('/settings')}
                  >
                    Editar meu perfil
                  </Button>
                )}
              </Flex>
              {(profile.plan === 'Pro') && 
                <>
                  <Title fz='1.03rem' fw='640'>Parceiros e Endorsements</Title>
                  <PartnersModule loading={profile.requesting} partners={profile.partners} showTitle={false} mt={4} mb={10} />
                </>
              }
              {profile.availabilityId && 
                <>
                  <Divider mt='md' mb='xs' label='Disponibilidade' labelPosition='left' />
                  {/* <Title fz='1.03rem' fw='640' mt='md' mb='xs'>
                    Disponibilidade e Preferências
                  </Title> */}
                  <Flex
                    align='center'
                    justify='flex-start'
                    gap={6}
                    mb={isMobile ? 0 : 6}
                  >
                    <Indicator
                      inline
                      processing={profile.availabilityId === 1}
                      color={profile.availabilityColor}
                      size={11}
                      ml={5}
                      mr={7}
                    />
                    <Text
                      fz='1.03rem'
                      fw='640'
                      className='lhNormal'
                      pt='1px'
                    >
                      {profile.availabilityTitle}
                    </Text>
                  </Flex>
                  <AvailabilityInfo mt={18} mb={18} screen='largeScreen' />
                  {isMobile &&
                    <Accordion chevronPosition='left'>
                      <Accordion.Item value='Exibir preferências musicais e de trabalho' style={{border:'0px'}}>
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
              {profile.availabilityId && 
                <Divider mb={2} mt={6} className='showOnlyInMobile' />
              }
              {!profile.availabilityId && 
                <Space h='xs' className='showOnlyInMobile' />
              }
              <Box className='showOnlyInLargeScreen' pr='lg'>
                <RelatedProfiles relatedUsers={profile.relatedUsers?.result} />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
              {profile.projects.total > 0 && 
                <>
                  <Projects 
                    profile={profile}
                    projects={allProjects}
                    profilePlan={profile.plan}
                  />
                  <Divider mt={12} mb={15} className='showOnlyInMobile' />
                </>
              }
              <Paper
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 16}
                pt={isMobile ? 0 : 12}
                pb={isMobile ? 3 : 12}
                mt='12'
                mb='14'
                className="mublinModule transparentBgInMobile"
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
                  {(profile.id === loggedUserId && !profile.requesting) &&
                    <ActionIcon
                      variant='transparent'
                      size='md'
                      aria-label='Ver votos'
                      title='Ver votos'
                      onClick={() => openVotesHistoryModal()}
                    >
                      <IconEye
                        color={colorScheme === 'light' ? 'black' : 'white'}
                        style={{ width: '91%', height: '91%' }} stroke={1.5}
                      />
                    </ActionIcon>
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
                      <Text size='sm' c='dimmed'>
                        Nenhum ponto forte votado para {profile.name} até o momento
                      </Text>
                    )}
                  </Box>
                )}
              </Paper>
              {profile.plan === 'Pro' ? ( 
                <GearSection
                  loggedUserId={loggedUserId}
                  username={username}
                />
              ) : (
                <>
                  {loggedUserId === profile.id && 
                    <Paper
                      withBorder={isLargeScreen ? true : false}
                      px={isMobile ? 0 : 16}
                      py={isMobile ? 0 : 12}
                      mb={8}
                      className='mublinModule transparentBgInMobile'
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
                withBorder={isLargeScreen ? true : false}
                px={isMobile ? 0 : 16}
                py={isMobile ? 0 : 12}
                mb={20}
                className='mublinModule transparentBgInMobile'
              >
                <Group justify='space-between' align='center' gap={8} mb={13}>
                  <Title fz='1.03rem' fw='640'>Postagens</Title>
                  {(profile.id === loggedUserId && !profile.requesting) && 
                    // <Button 
                    //   size='xs'
                    //   variant='light'
                    //   color={colorScheme === 'light' ? 'dark' : 'gray'}
                    //   leftSection={<IconPlus size={14} />}
                    //   onClick={() => setModalStrengthsOpen(true)}
                    // >
                    //   Nova postagem
                    // </Button>
                    <ActionIcon
                      variant='transparent'
                      size='md'
                      aria-label='Escrever uma publicação'
                      onClick={() => setShowModalNewPost(true)}
                      title='Escrever uma publicação'
                    >
                      <IconPlus 
                        color={colorScheme === 'light' ? 'black' : 'white'}
                        style={{ width: '91%', height: '91%' }} stroke={1.5}
                      />
                    </ActionIcon>
                  }
                </Group>
                {profile.requesting ? ( 
                  <Text size='sm'>Carregando...</Text>
                ) : (
                  profile.recentActivity.total ? (
                    <Grid>
                      {profile.recentActivity.result.slice(0, 2).map(activity =>
                        <Grid.Col span={{ base: 12, md: 6, lg: 6 }} key={activity.id}>
                          <Box style={{height:'auto'}}>
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
                {profile.recentActivity.total && 
                  <Text size='sm' className='op80 point' ta='center' mt='14' fw='460' onClick={() => setModalProfileFeedOpen(true)}>
                    Ver postagens
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
        opened={modalProfileFeedOpen}
        onClose={() => setModalProfileFeedOpen(false)}
        title={`Postagens de ${profile.name} ${profile.lastname}`}
        size='lg'
        scrollAreaComponent={ScrollArea.Autosize}
      >
        { profile.recentActivity.total && profile.recentActivity.result.map(activity =>
          <Box 
            key={activity.id}
            style={{height:'auto'}} 
          >
            <FeedCard item={activity} />
          </Box>
        )}
      </Modal>
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
          {/* {followedByMe.inspiration ? (
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
              color='primary'
              variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
              rightSection={<IconStar size={14} />}
              onClick={() => changeInspirationStatus(followedByMe.id, profile.id, "1")}
            >
              Adicionar como inspiração
            </Button>
          )} */}
          <Button 
            size='sm' 
            color='primary'
            variant='outline'
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
        <Text size='sm'><strong>Celular:</strong> {profile.phone ? profile.phone : 'Não informado'}</Text>
        <Text size='sm'><strong>Website:</strong> {profile.website ? profile.website : 'Não informado'}</Text>
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
              <Indicator position='bottom-center' inline label={<Text size='0.55rem' >{follower.openToWorkText}</Text>} color='lime' size={18} withBorder disabled={!follower.openToWork}>
                <Avatar className='point' radius='xl' size='md' src={follower.picture ? follower.picture : undefined} />
              </Indicator>
              <Flex direction={'column'} className='point'>
                <Group gap={0}>
                  <Text size='sm' fw={550} className='lhNormal'>
                    {follower.name} {follower.lastname}
                  </Text>
                  {follower.verified && 
                    <IconRosetteDiscountCheckFilled className='iconVerified' title='Verificado' />
                  }
                  {follower.legend_badge && 
                    <IconShieldCheckFilled className='iconLegend' title='Lenda da música' />
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
              <Indicator position='bottom-center' inline label={<Text size='0.55rem' >{following.openToWorkText}</Text>} color='lime' size={18} withBorder disabled={!following.openToWork}>
                <Avatar className='point' radius='xl' size='md' src={following.picture ? following.picture : undefined} />
              </Indicator>
              <Flex direction={'column'} className='point'>
                <Group gap={0}>
                  <Text size='sm' fw={550} className='lhNormal'>
                    {following.name} {following.lastname}
                  </Text>
                  {following.verified && 
                    <IconRosetteDiscountCheckFilled className='iconVerified' title='Verificado' />
                  }
                  {following.legend_badge && 
                    <IconShieldCheckFilled className='iconLegend' title='Lenda da música' />
                  }
                </Group>
                <Text size='xs' c='dimmed'>
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
          <Text size='xs'>Vote apenas nas áreas que você realmente conhece de {profile.name}. Ajude a manter a credibilidade na comunidade do Mublin :)</Text>
        </Alert>
        {strengths.map((strength,key) =>
          <div key={key}>
            <Radio
              my={5}
              id={'strengthsGroup_'+strength.id}
              color='violet'
              size='xs'
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
                    <i className={strength.icon+' fa-fw ml-1'}></i> <Text size='xs'>{strength.title}</Text>
                    {!!myVotes.filter((x) => { return x.strengthId === strength.id}).length && 
                      <>
                      <Text c='violet' size='xs' className='point' onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)}>
                        (retirar voto)
                      </Text>
                      {/* <Button
                        size='compact-xs'
                        variant='filled'
                        color='red'
                        fw='400'
                        onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)}
                        leftSection={<IconX size={14} />}
                      >
                        Retirar voto
                      </Button> */}
                      </>
                    }
                  </Group>
                </>
              }
            />
          </div>
        )}
        <Group mt='xs' justify='flex-end' gap={8}>
          <Button variant='outline' color='gray' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button loading={!strengthsLoaded} color='violet' onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <Modal 
        opened={modalStrengthVotesOpen}
        onClose={() => setModalStrengthVotesOpen(false)}
        title={user.plan === 'Pro' ? `${profile.strengthsVotesHistory.total} votos recebidos` : 'Histórico de votos'}
        centered
        size='sm'
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {user.plan === 'Pro' ? (
          <>
            {profile.requestingStrengthHistory ? (
              <>
                <Skeleton height={15} width={244} mb={8} radius='xl' />
                <Skeleton height={15} width={244} mb={8} radius='xl' />
                <Skeleton height={15} width={244} mb={8} radius='xl' />
              </>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr fz='xs'>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Modalidade</Table.Th>
                    <Table.Th>Data</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {profile.strengthsVotesHistory.result.map((vote, key) =>
                    <Table.Tr fz='xs' key={key}>
                      <Table.Td>
                        <Anchor 
                          href={'/'+vote.username} 
                        >
                          <Group gap={5}>
                            <Avatar src={vote.picture ? 'https://ik.imagekit.io/mublin/tr:h-40,w-40,c-maintain_ratio/users/avatars/'+vote.userId+'/'+vote.picture : null} size='20px' />
                            <Text fz='xs'>{vote.username}</Text>
                          </Group>
                        </Anchor>
                      </Table.Td>
                      <Table.Td>{vote.strength}</Table.Td>
                      <Table.Td>{vote.created}</Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            )}
          </>
        ) : (
          <>
            <Group gap={3} mb={8}>
              <Title fz='0.9rem' fw='620'>
                Não disponível no seu plano
              </Title>
              <IconLockSquareRoundedFilled size={22} color="gray" /> 
            </Group>
            <Text size='sm'>
              Torne-se PRO para habilitar esta funcionalidade em seu perfil e ver quem votou nos seus pontos fortes!
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
          </>
        )}
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
              { color: '#0977ff', width: rem(45), height: rem(45), marginLeft: '5px' }
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
        opened={showModalNewPost} 
        onClose={() => setShowModalNewPost(false)} 
        title='Escrever uma publicação'
        centered
      >
        <NewPost />
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
      {
        (!modalAvatarOpen && !modalFollowersOpen && !modalFollowingOpen && !modalStrengthsOpen && !modalVerifiedOpen && !modalLegendOpen && !modalProfileFeedOpen && !profile.activeModal) &&
          <FooterMenuMobile />
      }
    </>
  );
};

export default ProfilePage;