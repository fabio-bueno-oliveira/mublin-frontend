import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { profileInfos } from '../../store/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Paper, Title, Text, Image, NativeSelect, Group, Avatar, Box, Skeleton, SimpleGrid, useMantineColorScheme, Modal, Button, Badge } from '@mantine/core';
import { IconCircleFilled, IconCheck } from '@tabler/icons-react';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import './styles.scss';

function ProfilePage () {

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
    dispatch(profileInfos.getProfileAvailabilityItems(username));
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
            'Authorization': 'Bearer ' + user.token
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
        <Box mb={17}>
          {profile.requesting && 
            <>
            <Group justify='flex-start'>
              <Skeleton height={80} width={80} />
              <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                <Skeleton height={11} width={380} radius="xl" />
                <Skeleton height={14} width={380} radius="xl" />
                <Skeleton height={12} width={380} radius="xl" />
              </SimpleGrid>
            </Group>
            <Skeleton height={18} width={380} mt={16} radius="xl" />
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
                  <Title order={3}>{profile.name} {profile.lastname}</Title>
                  <Flex className='rolesList'>
                    {profile.roles.map((role, key) =>
                      <Flex gap={2} align={'center'} key={key}>
                        {role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' className={colorScheme === "dark" ? "imgToWhite" : undefined} />} <Text size='11px' mr={13}>{role.name}</Text>
                      </Flex>
                    )}
                  </Flex>
                  
                </Box>
              </Flex>
              {(profile.bio && profile.bio !== 'null') && 
                <Text size={largeScreen ? 'sm' : 'xs'} mt={14}>{profile.bio}</Text>
              }
            </>
          }
        </Box>
        <Paper radius="md" withBorder p="sm" mb={18}
          style={{ backgroundColor: 'transparent' }}
        >
          {profile.requesting ? ( 
            <>
              <Title order={4}>Disponibilidade</Title>
              <Text size='sm'>Carregando...</Text>
            </>
          ) : (
            <>
              <Flex align='center' gap={3}>
                <IconCircleFilled style={iconCircleStyles} color={profile.availabilityColor} />
                <Title order={4}>{profile.availabilityTitle}</Title>
              </Flex>
              {(profile.availabilityId === 1 || profile.availabilityId === 2) &&
                <>
                  <Text size='xs' mt={6}>
                    {profile.availabilityFocus === 1 && <span><IconCheck style={iconCircleStyles} />Projetos autorais</span>} 
                    {profile.availabilityFocus === 2 && <span><IconCheck style={iconCircleStyles} />Sideman</span>}
                    {profile.availabilityFocus === 3 && <><span><IconCheck style={iconCircleStyles} />Projetos autorais</span> <span><IconCheck style={iconCircleStyles} />Sideman</span></>}
                  </Text>
                  <Group gap={4} mt={5}>
                    {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                      <Badge size='xs' color='gray' key={key}>
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
          <Group justify="flex-start" align="center" mb={18}>
            <Title order={4}>Pontos Fortes</Title>
            {profile.id !== loggedUser.id && 
              <Button 
                size="compact-xs" 
                variant="default" 
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
            <Title order={4}>Projetos</Title>
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
            <Title order={4} mb={8}>Equipamento</Title>
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
        opened={modalStrengthsOpen} 
        onClose={() => setModalStrengthsOpen(false)} 
        title={`Votar pontos fortes de ${profile.name} ${profile.lastname}`}
        centered
        // fullScreen
      >
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
                <span><i className={strength.icon+' fa-fw ml-1'}></i> {strength.title}</span> {!!myVotes.filter((x) => { return x.strengthId === strength.id}).length && 
                  <>
                    {/* <IconX style={{ width: '8px', height: '8px', marginLeft: '3px', marginRight: '3px' }} onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)} /> */}
                    <Button size="compact-xs" variant="filled" color='red'
                      onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)}
                    >
                      Retirar
                    </Button>
                  </>
                }
              </label>
            </div>
          </div>
        )}
        <Group mt="md">
          <Button variant='outline' onClick={() => setModalStrengthsOpen(false)}>Fechar</Button>
          <Button onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)} disabled={strengthVoted ? false : true}>Votar</Button>
        </Group>
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;