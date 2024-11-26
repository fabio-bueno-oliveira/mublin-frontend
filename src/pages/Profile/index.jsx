import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate, Link } from 'react-router-dom';
import { profileInfos } from '../../store/actions/profile';
import { followInfos } from '../../store/actions/follow';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Grid, Paper, Title, Text, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, useMantineColorScheme, Modal, Button, Badge, ScrollArea, Alert, Tooltip, rem, em } from '@mantine/core';
import { IconCircleFilled, IconCheck, IconInfoCircleFilled, IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconStarFilled, IconBrandInstagram, IconMail, IconChevronDown } from '@tabler/icons-react';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import PartnersModule from './partners';
import './styles.scss';

function ProfilePage () {

  let navigate = useNavigate();
  const params = useParams();
  const username = params?.username;
  const loggedUser = JSON.parse(localStorage.getItem('user'));
  const profile = useSelector(state => state.profile);
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { colorScheme } = useMantineColorScheme();

  let dispatch = useDispatch();
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username));
    dispatch(followInfos.checkProfileFollowing(username));
    dispatch(profileInfos.getProfileAvailabilityItems(username));
    dispatch(profileInfos.getProfileFollowers(username));
    dispatch(profileInfos.getProfileFollowing(username));
    dispatch(profileInfos.getProfileProjects(username));
    dispatch(profileInfos.getProfileRoles(username));
    dispatch(profileInfos.getProfileGenres(username));
    dispatch(profileInfos.getProfileGear(username));
    // dispatch(profileInfos.getProfileGearSetups(username));
    dispatch(profileInfos.getProfilePartners(username));
    dispatch(profileInfos.getProfileStrengths(username));
    dispatch(profileInfos.getProfileStrengthsTotalVotes(username));
    dispatch(profileInfos.getProfileStrengthsRaw(username));

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
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '5px' };
  const iconCircleStyles = { width: '11px', height: '11px', marginLeft: '3px', marginRight: '3px' };
  const iconAvailabilityStyles = { width: '14px', height: '14px', marginLeft: '3px', marginRight: '3px' };

  // Projects
  const allProjects = profile.projects.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 });
  // const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 });
  // const portfolioProjects = profile.projects.filter((project) => { return project.portfolio === 1 && project.confirmed === 1 });

  // Gear
  const [gearSetupProducts, setGearSetupProducts] = useState('');
  const [gearCategorySelected, setGearCategorySelected] = useState('');
  const gearTotal = useSelector(state => state.profile.gear).filter((product) => { return (gearSetupProducts) ? gearSetupProducts.find(x => x.productId === product.productId) : product.productId > 0 });
  const gear = gearTotal.filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 });

  // Carousels
  const [emblaRef1] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )
  const [emblaRef2] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )
  const [emblaRefprojects] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )

  // Modal Bio
  const [modalBioOpen, setModalBioOpen] = useState(false);
  // Modal Contact
  const [modalContactOpen, setModalContactOpen] = useState(false);
  // Modal Followers
  const [modalFollowersOpen, setModalFollowersOpen] = useState(false);
  // Modal Following
  const [modalFollowingOpen, setModalFollowingOpen] = useState(false);

  const followUnfollow = () => {
    if (!followedByMe.following || followedByMe.following === 'false') {
        setLoadingFollow(true)
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
            setLoadingFollow(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao tentar seguir o usuário")
        })
    } else if (followedByMe.following === 'true') {
        setLoadingFollow(true)
        fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then((response) => {
            dispatch(followInfos.checkProfileFollowing(username));
            dispatch(profileInfos.getProfileFollowers(username));
            setLoadingFollow(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao deixar de seguir o usuário")
        })
    }
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

  return (
    <>
      <Header pageType='profile' username={username} />
      <Container size={'lg'} mb={largeScreen ? 30 : 82} pt={largeScreen ? 10 : 0} className='profilePage'>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
            {profile.requesting && 
              <>
                <Group justify='flex-start'>
                  <Skeleton height={56} circle />
                  <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                    <Skeleton height={10} width={240} radius="xl" />
                    <Skeleton height={13} width={240} radius="xl" />
                    <Skeleton height={11} width={240} radius="xl" />
                  </SimpleGrid>
                </Group>
                <Skeleton height={15} width={312} mt={16} mb={20} radius="xl" />
              </>
            }
            {!profile.requesting && 
              <Grid mb={largeScreen ? 45: 20}>
                <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
                  <Flex
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="nowrap"
                    columnGap="xs"
                    mt={6}
                  >
                    <Avatar
                      size={largeScreen ? 'xl' : 'lg'}
                      src={profile.picture}
                    />
                    <Box style={{ overflow: 'hidden' }}>
                      <Flex align={'center'}>
                        <Title order={largeScreen ? 3 : 4}>{profile.name} {profile.lastname}</Title>
                        {!!profile.verified && 
                          <Tooltip label="Usuário Verificado">
                            <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                          </Tooltip>
                        }
                        {!!profile.legend && 
                          <Tooltip label={`${profile.name} ${profile.lastname} possui o selo de 'Lenda da Música' pois é reconhecido por um grande número de pessoas como alguém relevante no cenário musical`} multiline withArrow w={180}>
                            <IconShieldCheckFilled style={iconLegendStyle} />
                          </Tooltip>
                        }
                      </Flex>
                      <Flex className='rolesList'>
                        {profile.roles.map((role, key) =>
                          <Flex gap={2} align={'center'} key={key}>
                            {role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' className={colorScheme === "dark" ? "imgToWhite" : undefined} />} <Text size='11px' mr={13}>{role.name}</Text>
                          </Flex>
                        )}
                      </Flex>
                      <Group gap={12} mt={4}>
                        <Text className='point' size='sm' fw={500} onClick={() => setModalFollowersOpen(true)}>
                          {profile.followers.length} seguidores
                        </Text>
                        <Text className='point' size='sm' fw={500} onClick={() => setModalFollowingOpen(true)}>
                          {profile.following.length} seguindo
                        </Text>
                      </Group>
                    </Box>
                  </Flex>
                  {(profile.bio && profile.bio !== 'null') && 
                    <Text 
                      size={largeScreen ? 'sm' : 'xs'} mt={14} lineClamp={3}
                      onClick={!largeScreen ? () => setModalBioOpen(true) : undefined}
                    >
                      {profile.bio}
                    </Text>
                  }
                  <Group gap={5} mt={12}>
                    {followedByMe?.requesting ? (
                      <Button size="xs" disabled>Carregando...</Button>
                    ) : (
                      <>
                        {loggedUser.id !== profile.id ? (
                          <Button 
                            size="xs" 
                            color={colorScheme === "light" ? "dark" : "gray"}
                            variant={followedByMe?.following === 'true' ? 'light' : 'filled'}
                            loading={loadingFollow}
                            rightSection={followedByMe?.following === 'true' ? <IconChevronDown size={14} /> : undefined}
                            onClick={followedByMe?.following === 'true' ? () => followUnfollow() : () => followUnfollow()}
                          >
                            {followedByMe?.following === 'true' ? 'Seguindo' : 'Seguir'}
                          </Button>
                        ) : (
                          <Button 
                            size="xs" 
                            variant='light'
                            color={colorScheme === "light" ? "dark" : "gray"}
                            onClick={() => navigate('/settings/profile')}
                          >
                            Editar perfil
                          </Button>
                        )}
                        <Button 
                          size="xs" 
                          variant='light'
                          color={colorScheme === "light" ? "dark" : "gray"}
                          leftSection={<IconMail size={14} />} 
                          onClick={() => setModalContactOpen(true)}
                        >
                          Contato
                        </Button>
                        {profile.instagram && 
                          <>
                          <Link to={`https://instagram.com/${profile.instagram}`} target="_blank">
                            <Button
                              leftSection={<IconBrandInstagram size={14} />} 
                              size="xs" 
                              variant='light'
                              color={colorScheme === "light" ? "dark" : "gray"}
                            >
                              Instagram
                            </Button>
                          </Link>
                          {/* <ActionIcon 
                            size="30px" 
                            w={28} 
                            variant="outline" 
                            color={colorScheme === "light" ? "dark" : "white"}
                            component="a"
                            href={`https://instagram.com/${profile.instagram}`}
                            target='_blank'
                          >
                            <IconBrandInstagram style={{ width: '70%', height: '70%' }} stroke={1.5} />
                          </ActionIcon> */}
                          </>
                        }
                      </>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
                  <Box>
                    <Flex align='center' gap={3} mb={10} mt={largeScreen ? 20 : 5}>
                      <IconCircleFilled style={iconCircleStyles} color={profile.availabilityColor} />
                      <Title order={6}>{profile.availabilityTitle}</Title>
                    </Flex>
                    <Text size="xs" fw={500}>
                      Estilos musicais:
                    </Text>
                    <Group gap={4}>
                      {profile.requesting ? (
                        <Text size='xs' mx={0}>Carregando...</Text>
                      ) : (
                        <Text size='xs' mx={0}>
                          {profile.genres[0].id && profile.genres.map((genre, key) =>
                            <span key={key} className="comma">{genre.name}</span>
                          )}
                        </Text>
                      )}
                    </Group>
                    <Text size="xs" fw={500} mt={7} >
                      Tipos de projetos:
                    </Text>
                    <Group gap={4}>
                      {profile.requesting ? (
                        <Text size='xs' mx={0}>Carregando...</Text>
                      ) : (
                        <Text size='xs' mx={0}>
                          {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
                            <span className="comma">Autorais</span>
                          }
                          {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
                            <span className="comma">Contratado</span>
                          }
                        </Text>
                      )}
                    </Group>
                    <Text size="xs" fw={500} mt={7} mb={3}>
                      Tipos de trabalho:
                    </Text>
                    {profile.availabilityItems[0].id ? (
                      <Group gap={4}>
                        {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                          <Badge leftSection={<IconCheck style={{ width: '10px', height: '10px' }} />} size='xs' color="rgba(18, 18, 18, 1)" key={key} mx={0}>
                            {item.itemName}
                          </Badge>
                        )}  
                      </Group>
                    ) : (
                      <Text size="11px" c="dimmed">
                        Não informado
                      </Text>
                    )}
                  </Box>
                </Grid.Col>
              </Grid>
            }
            {profile.plan === "Pro" && 
              <PartnersModule loading={profile.requesting} partners={profile.partners} />
            }
            <Box mb={18}>
              <Group justify="flex-start" align="center" gap={8} mb={18}>
                <Title order={5}>Pontos Fortes ({profile?.strengths?.total})</Title>
                {profile.id !== loggedUser.id && 
                  <Button 
                    size="compact-xs" 
                    color="violet"
                    onClick={() => setModalStrengthsOpen(true)}
                  >
                    Votar
                  </Button>
                }
              </Group>
              {profile.requesting ? ( 
                <Text size='sm'>Carregando...</Text>
              ) : (
                <>
                  {(profile.strengths.total && profile.strengths.result[0].idUserTo === profile.id) ? ( 
                    <div className="embla strengths" ref={emblaRef1}>
                      <div className="embla__container">
                        {profile.strengths.result.map((strength, key) =>
                        <>
                          <Flex 
                            justify="flex-start"
                            align="center"
                            direction="column"
                            wrap="wrap"
                            className="embla__slide"
                            key={key}
                          >
                            <i className={strength.icon}></i>
                            <Text order={6} fw={500} mb={2} mt={3} size={'xs'} align='center' truncate="end">
                              {strength.strengthTitle}
                            </Text>
                            <Text size='10px'>
                              {strength.totalVotes + (strength.totalVotes > 1 ? ' votos' : ' voto')}
                            </Text>
                          </Flex>
                        </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Text size='xs'>
                      Nenhum ponto forte votado para {profile.name} até o momento
                    </Text>
                  )}
                </>
              )}
            </Box>
            {isMobile && 
              <Paper radius="md" withBorder px="sm" py="xs" mb={18}
                style={{ backgroundColor: 'transparent' }}
              >
                <Group justify="flex-start" align="center" mb={18}>
                  <Title order={5}>Projetos ({profile?.projects?.length})</Title>
                </Group>
                {profile.requesting ? ( 
                    <Text size='sm'>Carregando...</Text>
                ) : (
                  <>
                    {profile.projects[0].id ? ( 
                      <div className="embla projects" ref={emblaRefprojects}>
                        <div className="embla__container">
                          {allProjects.map((project, key) =>
                            <Flex 
                              justify="flex-start"
                              align="center"
                              direction="column"
                              wrap="wrap"
                              className="embla__slide"
                              key={key}
                            >
                              <Text size='11px' mb={3}>
                              {project.left_in && "ex "} {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3} em
                              </Text>
                              <Image 
                                src={project.picture} 
                                w={80}
                                mb={10}
                                radius={3}
                              />
                              <Box w={90}>
                                <Text ta="center" size='12px' fw={500} mb={3} truncate="end">
                                  {project.name}
                                </Text>
                              </Box>
                              <Text ta="center" size='11px'>{project.type}</Text>
                              <Text ta="center" size='11px'>{project.workTitle}</Text>
                            </Flex>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Text size='xs'>
                        Nenhum projeto cadastrado
                      </Text>
                    )}
                  </>
                )}
              </Paper>
            }
            {profile.plan === "Pro" && 
              <Box mb={25}>
                <Title order={5} mb={8}>Equipamento</Title>
                {profile.requesting ? ( 
                  <Text size='sm'>Carregando...</Text>
                ) : (
                  <>
                    {profile.gear[0]?.brandId && 
                      <Group mb={20}>
                        {/* <NativeSelect 
                          size="xs"
                          w={138}
                          onChange={(e) => getSetupProducts(e.target.options[e.target.selectedIndex].value)}
                        >
                          <option>Setup completo</option>
                          {profile.gearSetups[0].id && profile.gearSetups.map((setup, key) =>
                            <option key={key} value={setup.id}>
                              {setup.name}
                            </option>
                          )}
                        </NativeSelect> */}
                        <NativeSelect 
                          size="xs"
                          w={132}
                          onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                        >
                          <option value=''>
                            {'Exibir tudo ('+gearTotal.length+')'}
                          </option>
                          {profile.gearCategories.map((gearCategory, key) =>
                            <option key={key} value={gearCategory.category}>
                              {gearCategory.category + '(' + gearCategory.total + ')'}
                            </option>
                          )}
                        </NativeSelect>
                      </Group>
                    }
                    {profile.gear[0]?.brandId ? ( 
                      <div className="embla gear" ref={emblaRef2}>
                        <div className="embla__container">
                          {gear.map((product, key) =>
                            <div className="embla__slide" key={key}>
                              <Link to={{ pathname: `/gear/product/${product.productId}` }}>
                                <Image 
                                  src={product.picture} 
                                  w={80}
                                  mb={10}
                                  onClick={() => history.push('/gear/product/'+product.productId)}
                                />
                              </Link>
                              <Text size='13px' fw={500} mb={3}>{product.brandName}</Text>
                              <Text size='12px'>{product.productName}</Text>
                              {product.tuning && 
                                <Group gap={2} mt={4}>
                                  <Text size='9px'>Afinação: {product.tuning}</Text>
                                  <Tooltip label={product.tuningDescription}>
                                    <IconInfoCircleFilled style={{ width: '11px', height: '11px' }} color="gray" />
                                  </Tooltip>
                                </Group>
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Text size='xs'>Nenhum equipamento cadastrado</Text>
                    )}
                  </>
                )}
              </Box>
            }
          </Grid.Col>
          {largeScreen && 
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <Paper radius="md" withBorder px="md" py="md" mb={18}
                style={{ backgroundColor: 'transparent' }}
              >
                <ScrollArea h={422} offsetScrollbars>
                  <Group justify="flex-start" align="center" mb={18}>
                    <Title order={5}>Projetos ({profile?.projects?.length})</Title>
                  </Group>
                  {profile.requesting ? ( 
                      <Text size='sm'>Carregando...</Text>
                  ) : (
                    <>
                      {profile.projects[0].id ? ( 
                        <>
                          {allProjects.map((project, key) =>
                            <Flex gap={10} mb={10}>
                              <Avatar 
                                variant="filled" 
                                radius="md" 
                                size="70px" 
                                color="violet"
                                name={"🎵"}
                                src={project.picture ? project.picture : undefined} 
                              />
                              <Flex 
                                direction={'column'}
                                justify="flex-start"
                                align="flex-start"
                                wrap="wrap"
                                key={key}
                              >
                                <Text size='11px' mb={3}>
                                  {project.left_in && "ex "} {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3} em
                                </Text>
                                <Text size='13px' fw={500} mb={3}>
                                  {project.name} {!!project.featured && <IconStarFilled style={{ width: '12px', height: '12px' }} color='gold' />}
                                </Text>
                                <Text size='12px'>{project.type}</Text>
                                {/* <Text size='12px'>{project.workTitle}</Text> */}
                              </Flex>
                            </Flex>
                          )}
                        </>
                      ) : (
                        <Text size='xs'>
                          Nenhum projeto cadastrado
                        </Text>
                      )}
                    </>
                  )}
                </ScrollArea>
              </Paper>
            </Grid.Col>
          }
        </Grid>
      </Container>
      <Modal 
        centered
        opened={modalBioOpen} 
        onClose={() => setModalBioOpen(false)} 
        title={'Sobre '+profile.name}
        scrollAreaComponent={ScrollArea.Autosize}
        fullScreen
      >
        <Text size={'sm'}>{profile.bio}</Text>
      </Modal>
      <Modal 
        centered
        opened={modalContactOpen} 
        onClose={() => setModalContactOpen(false)} 
        title={'Contactar '+profile.name}
      >
        <Text size={'sm'}><strong>Localidade:</strong> {profile.city}, {profile.region}</Text>
        <Text size={'sm'}><strong>E-mail:</strong> {profile.email}</Text>
      </Modal>
      <Modal 
        centered
        opened={modalFollowersOpen} 
        onClose={() => setModalFollowersOpen(false)} 
        title={profile.followers.length+' seguidores'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.followers.map((follower, key) => 
          <Flex align={'center'} gap={7} mb={6} onClick={() => goToProfile(follower.username)}>
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
              <Text size='xs' key={key}>
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
        title={'Seguindo '+profile.following.length}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.following.map((following, key) => 
          <Flex align={'center'} gap={7} mb={6} onClick={() => goToProfile(following.username)}>
            <Avatar className='point' radius="xl" size="md" src={following.picture ? following.picture : undefined} />
            <Flex direction={'column'} className='point'>
              <Text size='sm' fw={500}>{following.name} {following.lastname}</Text>
              <Text size='xs' key={key}>
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
        <Alert variant="light" mb={10} p={'xs'} color="yellow">
          <Text size="xs">Vote apenas nas áreas que você realmente conhece de {profile.name}. Ajude a manter o Mublin uma comunidade com credibilidade</Text>
        </Alert>
        {strengths.map((strength,key) =>
          <div key={key}>
            <div className={myVotes.filter((x) => { return x.strengthId === strength.id}).length ? 'ui radio checkbox voted' : 'ui radio checkbox' }>
              <input 
                disabled={myVotes.filter((x) => { return x.strengthId === strength.id}).length}
                id={'strengthsGroup_'+strength.id}
                name={!myVotes.filter((x) => { return x.strengthId === strength.id}).length ? 'strengthsGroup' : ''} 
                type="radio" 
                className="hidden" 
                value={strength.id}
                checked={(strength.id === strengthVoted || myVotes.filter((x) => { return x.strengthId === strength.id}).length) ? true : false}
                onChange={() => {
                  setStrengthVoted(strength.id);
                  setStrengthVotedName(strength.title);
                }}
              />
              <label for={'strengthsGroup_'+strength.id} className={myVotes.filter((x) => { return x.strengthId === strength.id}).length && 'voted'}>
                <span style={{fontSize: '13px'}}><i className={strength.icon+' fa-fw ml-1'}></i> {strength.title}</span> {!!myVotes.filter((x) => { return x.strengthId === strength.id}).length && 
                  <Button size="compact-xs" variant="outline" color='red'
                    onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)}
                  >
                    Retirar
                  </Button>
                }
              </label>
            </div>
          </div>
        )}
        <Group mt="xs" justify="flex-end" gap={8}>
          <Button variant='outline' color='violet' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button loading={!strengthsLoaded} color='violet' onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;