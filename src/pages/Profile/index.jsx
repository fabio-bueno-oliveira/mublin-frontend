import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { profileInfos } from '../../store/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Paper, Title, Text, Image, NativeSelect, Group, Badge, Button, Box, Skeleton, SimpleGrid } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import './styles.scss';

function ProfilePage () {

  const params = useParams();
  const username = params?.username;
  const profile = useSelector(state => state.profile);

  let dispatch = useDispatch();
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username));
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
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const [emblaRef] = useEmblaCarousel(
    {
      active: (
        (largeScreen && gear.length < 10) || (!largeScreen && gear.length < 3)
      ) ? false : true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
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
                <Image
                  radius="md"
                  h={80}
                  w="auto"
                  fit="contain"
                  src={profile.picture}
                />
                <Box>
                  <Text size='sm' c='dimmed'>{username}</Text>
                  <Title order={3}>{profile.name} {profile.lastname}</Title>
                  <Flex>
                    {profile.roles.map((role, key) =>
                      <Group gap={3} key={key}>
                        {role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' />} <Text size='12px' mr={13}>{role.name}</Text>
                      </Group>
                    )}
                  </Flex>
                </Box>
              </Flex>
              <Text size='sm' mt={14}>{profile.bio}</Text>
            </>
          }
        </Box>
        <Paper shadow="md" radius="md" withBorder p="md" mb={18}
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
                <div className="embla" ref={emblaRef}>
                  <div className="embla__container">
                    {profile.strengths.map((strength, key) =>
                      <Flex 
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        className="embla__slide"
                        key={key}
                      >
                        <i className={strength.icon}></i>
                        <Title order={6} fw={500} mb={2} mt={3}>{strength.strengthTitle}</Title>
                        <Badge variant='default'>{strength.percent}</Badge>
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
        {profile.plan === "Pro" && 
          <Paper shadow="md" radius="md" withBorder p="md" mb={25}
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
                    w={200}
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
                    w={200}
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
                {profile.gear[0].brandId ? ( 
                  <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                      {gear.map((product, key) =>
                        <div className="embla__slide" key={key}>
                          <Image 
                            src={product.picture} 
                            w={80}
                            mb={10}
                            onClick={() => history.push('/gear/product/'+product.productId)}
                          />
                          <Text size='12px' fw={500} mb={3}>{product.brandName}</Text>
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