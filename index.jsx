import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { profileInfos } from '../../store/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Paper, Title, Text, Image, NativeSelect, Group, Avatar, Button, Box, Skeleton, SimpleGrid, useMantineColorScheme } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import './styles.scss';

function ProfilePage () {

  const params = useParams();
  const username = params?.username;
  const profile = useSelector(state => state.profile);
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const { colorScheme } = useMantineColorScheme();

  let dispatch = useDispatch();
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username));
    dispatch(profileInfos.getProfileProjects(username));
    dispatch(profileInfos.getProfileRoles(username));
    dispatch(profileInfos.getProfileGear(username));
    dispatch(profileInfos.getProfileGearSetups(username));
    dispatch(profileInfos.getProfileStrengths(username));
    dispatch(profileInfos.getProfileStrengthsRaw(username));
  }, []);

  document.title = `${profile.name} ${profile.lastname} | Mublin`;

  // Gear
  const [gearSetupProducts, setGearSetupProducts] = useState('');
  const [gearCategorySelected, setGearCategorySelected] = useState('');
  const gearTotal = useSelector(state => state.profile.gear).filter((product) => { return (gearSetupProducts) ? gearSetupProducts.find(x => x.productId === product.productId) : product.productId > 0 });
  const gear = gearTotal.filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 });

  // Carousel
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
                <Text size='xs' mt={14}>{profile.bio}</Text>
              }
            </>
          }
        </Box>
        <Paper radius="md" withBorder p="md" mb={18}
          style={{ backgroundColor: 'transparent' }}
        >
          <Group justify="flex-start" align="center" mb={18}>
            <Title order={4}>Pontos Fortes</Title>
            <Button size="compact-xs" variant="default">Votar</Button>
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
                <Text size='11px'>
                  Nenhum ponto forte votado para {profile.name} até o momento
                </Text>
              )}
            </>
          )}
        </Paper>
        <Paper radius="md" withBorder p="md" mb={18}
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
                <div className="embla strengths" ref={emblaRef1}>
                  <div className="embla__container">
                    {mainProjects.map((projeto, key) =>
                      <Flex 
                        justify="flex-start"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        className="embla__slide"
                        key={key}
                      >
                        <Image src={projeto.picture} />
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
          <Paper radius="md" withBorder p="md" mb={25}
            style={{ backgroundColor: 'transparent' }}
          >
            <Title order={4} mb={8}>Equipamento</Title>
            {profile.requesting ? ( 
              <Text size='sm'>Carregando...</Text>
            ) : (
              <>
                <Group mb={20}>
                  <NativeSelect 
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
                  </NativeSelect>
                  <NativeSelect 
                    size="xs"
                    w={132}
                    onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                  >
                    <option value=''>
                      {'Exibir tudo ('+gear.length+')'}
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
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;