import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { profileInfos } from '../../store/actions/profile';
import { followInfos } from '../../store/actions/follow';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Paper, Title, Text, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, useMantineColorScheme, Modal, Button, Badge, ScrollArea, Alert, Tooltip, rem } from '@mantine/core';
import { IconCircleFilled, IconCheck, IconInfoCircle, IconBulb, IconIdBadge2, IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import './styles.scss';

function ProfilePage () {

  let navigate = useNavigate();
  const params = useParams();
  const username = params?.username;
  const loggedUser = JSON.parse(localStorage.getItem('user'));
  const profile = useSelector(state => state.profile);
  const largeScreen = useMediaQuery('(min-width: 60em)');
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
    dispatch(profileInfos.getProfileGear(username));
    dispatch(profileInfos.getProfileGearSetups(username));
    dispatch(profileInfos.getProfileStrengths(username));
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

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '2px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '2px' };
  const iconCircleStyles = { width: '10px', height: '10px', marginLeft: '3px', marginRight: '3px' };

  // Projects
  const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 })

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
      <Container size={'lg'} mb={largeScreen ? 30 : 82} className='profilePage'>
        <Box mb={15}>
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
            <Skeleton height={15} width={312} mt={16} radius="xl" />
            </>
          }
          {!profile.requesting && 
            <>
              <Flex
                justify="flex-start"
                align="center"
                direction="row"
                wrap="nowrap"
                columnGap="xs"
                mt={6}
              >
                <Avatar
                  size={'lg'}
                  src={profile.picture}
                />
                <Box style={{ overflow: 'hidden' }}>
                  <Flex align={'center'}>
                    <Title order={4}>{profile.name} {profile.lastname}</Title>
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
                  <Group gap={8} mt={4}>
                    {profile.followers.length ? (
                      <Text size={'xs'} fw={500} onClick={() => setModalFollowersOpen(true)}>
                        {profile.followers.length} seguidores
                      </Text>
                    ) : (
                      <Text size={'xs'} fw={500} onClick={() => setModalFollowersOpen(true)}>
                        {profile.followers.length} seguidores
                      </Text>
                    )}
                    {profile.following.length ? (
                      <Text size={'xs'} fw={500} onClick={() => setModalFollowingOpen(true)}>
                        {profile.following.length} seguindo
                      </Text>
                    ) : (
                      <Text size={'xs'} fw={500} onClick={() => setModalFollowingOpen(true)}>
                        {profile.following.length} seguindo
                      </Text>
                    )}
                  </Group>
                </Box>
              </Flex>
              {(profile.bio && profile.bio !== 'null') && 
                <Text 
                  size={largeScreen ? 'sm' : 'xs'} mt={14} lineClamp={3}
                  onClick={() => setModalBioOpen(true)}
                >
                  {profile.bio}
                </Text>
              }
            </>
          }
          <Box mt={12}>
            {followedByMe?.requesting ? (
              <Button size="xs" disabled>Carregando...</Button>
            ) : (
              loggedUser.id !== profile.id ? (
                <Button 
                  size="xs" 
                  color={colorScheme === "light" ? "dark" : "violet"}
                  loading={loadingFollow} 
                  variant={followedByMe?.following === 'true' ? 'outline' : 'filled'}
                  onClick={() => followUnfollow()}
                >
                  {followedByMe?.following === 'true' ? 'Seguindo' : 'Seguir'}
                </Button>
              ) : (
                <Button 
                  size="xs" 
                  variant='outline'
                  color={colorScheme === "light" ? "dark" : "white"}
                  onClick={() => navigate('/settings/profile')}
                >
                  Editar meu perfil
                </Button>
              )
            )}
          </Box>
        </Box>
        <Paper radius="md" withBorder p="sm" mb={18}
          style={{ backgroundColor: 'transparent' }}
        >
          {profile.requesting ? ( 
            <>
              <Title order={5}>Disponibilidade</Title>
              <Text size='sm'>Carregando...</Text>
            </>
          ) : (
            <>
              <Flex align='center' gap={3}>
                <IconCircleFilled style={iconCircleStyles} color={profile.availabilityColor} />
                <Title order={5}>{profile.availabilityTitle}</Title>
              </Flex>
              {(profile.availabilityId === 1 || profile.availabilityId === 2) &&
                <>
                  <Text size='xs' mt={6}>
                    {profile.availabilityFocus === 1 && <span><IconBulb style={iconCircleStyles} />Projetos autorais</span>} 
                    {profile.availabilityFocus === 2 && <span><IconIdBadge2 style={iconCircleStyles} />Sideman</span>}
                    {profile.availabilityFocus === 3 && <><span><IconBulb style={iconCircleStyles} />Projetos autorais</span> <span><IconIdBadge2 style={iconCircleStyles} />Sideman</span></>}
                  </Text>
                  <Group gap={4} mt={5}>
                    {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                      <Badge leftSection={<IconCheck style={{ width: '10px', height: '10px' }} />} size='xs' color='gray' key={key} mx={0}>
                        {item.itemName}
                      </Badge>
                    )}  
                  </Group>
                </>
              }
            </>
          )}
        </Paper>
        <Paper radius="md" withBorder px="sm" py="xs" mb={18}
          style={{ backgroundColor: 'transparent' }}
        >
          <Group justify="flex-start" align="center" gap={5} mb={18}>
            <Title order={5}>Pontos Fortes ({profile?.strengths?.length})</Title>
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
              {(profile.strengths[0].strengthId && profile.strengths[0].idUserTo === profile.id) ? ( 
                <div className="embla strengths" ref={emblaRef1}>
                  <div className="embla__container">
                    {profile.strengths.map((strength, key) =>
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
                        {/* <Badge variant='default'>{strength.percent}</Badge> */}
                      </Flex>
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
        </Paper>
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
                    {mainProjects.map((project, key) =>
                      <Flex 
                        justify="flex-start"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        className="embla__slide"
                        key={key}
                      >
                        <Image 
                            src={project.picture} 
                            w={80}
                            mb={10}
                            radius={3}
                        />
                        <Text size='13px' fw={500} mb={3}>{project.name}</Text>
                        <Text size='12px'>{project.type}</Text>
                        <Text size='12px'>{project.workTitle}</Text>
                      </Flex>
                    )}
                  </div>
                </div>
              ) : (
                <Text size='11px'>
                  Nenhum projeto cadastrado
                </Text>
              )}
            </>
          )}
        </Paper>
        {profile.plan === "Pro" && 
          <Paper radius="md" withBorder px="sm" py="xs" mb={25}
            style={{ backgroundColor: 'transparent' }}
          >
            <Title order={5} mb={8}>Equipamento</Title>
            {profile.requesting ? ( 
              <Text size='sm'>Carregando...</Text>
            ) : (
              <>
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
                {profile.gear[0]?.brandId ? ( 
                  <div className="embla gear" ref={emblaRef2}>
                    <div className="embla__container">
                      {gear.map((product, key) =>
                        <div className="embla__slide" key={key}>
                          <Image 
                            src={product.picture} 
                            w={80}
                            mb={10}
                            onClick={() => history.push('/gear/product/'+product.productId)}
                          />
                          <Text size='13px' fw={500} mb={3}>{product.brandName}</Text>
                          <Text size='12px'>{product.productName}</Text>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Text size='11px'>Nenhum equipamento cadastrado</Text>
                )}
              </>
            )}
          </Paper>
        }
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
        opened={modalFollowersOpen} 
        onClose={() => setModalFollowersOpen(false)} 
        title={profile.followers.length+' seguidores'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {profile.followers.map((follower, key) => 
          <Flex align={'center'} gap={7} mb={6} onClick={() => goToProfile(follower.username)}>
            <Avatar radius="xl" size="md" src={follower.picture ? follower.picture : undefined} />
            <Flex direction={'column'}>
              <Text size={'sm'}>{follower.name}</Text>
              <Text size={'10px'} key={key}>
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
            <Avatar radius="xl" size="md" src={following.picture ? following.picture : undefined} />
            <Flex direction={'column'}>
              <Text size={'sm'}>{following.name}</Text>
              <Text size={'10px'} key={key}>
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
        <Alert variant="light" mb={10} p={'xs'} color="yellow" icon={<IconInfoCircle />}>
          <Text size="xs">Vote apenas nas áreas que você realmente conhece de {profile.name}. Ajude a manter o Mublin uma comunidade com credibilidade!</Text>
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
        <Group mt="xs" gap={8}>
          <Button variant='outline' size='xs' color='violet' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button size='xs' color='violet' onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;