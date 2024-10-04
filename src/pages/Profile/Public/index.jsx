import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profileInfos } from '../../../store/actions/profile';
import Header from '../../../components/header/public';
import Footer from '../../../components/footer/public';
import { 
  Container, Box, Button, Center, 
  Flex, Group, Image, 
  Title, Text, Badge, 
  Skeleton, Space, 
  Pill, Indicator 
} from '@mantine/core';

function PublicProfilePage () {

    const params = useParams();
    const username = params.username;
    // const loggedIn = useSelector(state => state.authentication.loggedIn);
    const cdnBaseURL = 'https://ik.imagekit.io/mublin';

    let dispatch = useDispatch();

    useEffect(() => {
      dispatch(profileInfos.getProfileInfo(username));
      dispatch(profileInfos.getProfileProjects(username));
      dispatch(profileInfos.getProfileRoles(username));
      dispatch(profileInfos.getProfileFollowers(username));
      dispatch(profileInfos.getProfileFollowing(username));
      dispatch(profileInfos.getProfileAvailabilityItems(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);

    document.title = profile.id ? `${profile.name} ${profile.lastname} - Mublin` : 'Mublin';

    return (
      <>
        <Header />
        <Container size={'lg'}>
          {profile.requesting &&
            <>
              <Skeleton height={100} circle mb="xl" />
              <Skeleton height={24} radius="xl" />
              <Skeleton height={24} mt={6} radius="xl" />
              <Skeleton height={24} mt={6} width="70%" radius="xl" />
            </>
          }

          {(!profile.requesting && profile.id) && 
            <>
              <Flex
                mih={50}
                gap="md"
                justify="flex-start"
                align="flex-start"
                direction="row"
                pt="xl"
                pb="sm"
              >
                {!profile.pictureLarge ? (
                  <Image
                    h={140}
                    w={140}
                    fit="contain"
                    radius="lg"
                    src={`https://placehold.co/140x140?text=${username}`}
                  />
                ) : (
                  <Image
                    h={140}
                    w="auto"
                    fit="contain"
                    radius="lg"
                    src={profile.pictureLarge}
                    alt={`Foto de perfil de ${profile.name} ${profile.lastname} no Mublin`} 
                    fallbackSrc="https://placehold.co/140x140?text=Placeholder"
                  />
                )}
                <div>
                  <Text size="xl">{username}</Text>
                  <Group gap="xs">
                    <Text size="sm">{`${profile?.followers?.length} seguidores`}</Text>
                    <Text size="sm">{`${profile?.following?.length} seguindo`}</Text>
                  </Group>
                  {profile.city && 
                    <Group gap="xs" mb="xs">
                      <Text c="dimmed" size="sm">
                        {profile.city}, {profile.region}, {profile.country}
                      </Text>
                    </Group>
                  }
                  <Title order={3}>
                    {`${profile.name} ${profile.lastname}`}
                  </Title>
                  <Indicator 
                    inline 
                    color={profile.availabilityColor} 
                    size={8} 
                    processing 
                    style={{position: 'absolute'}}
                    position='left'
                  >
                    <Pill>
                        {profile.availabilityTitle}
                    </Pill>
                  </Indicator>
                </div>
              </Flex>
              {(profile.bio && profile.bio !== "null") && 
                <>
                  <Space h="sm" />
                  <Text mb='sm'>{profile.bio}</Text>
                </>
              }
              <Text size="sm" c="dimmed">Instrumentos e habilidades:</Text>
              <Group gap="xs" mb='xl' mt='xs'>
                {profile.roles.map((role, key) =>
                  <>
                    <Badge color="#d0d4d7" autoContrast key={key}>
                      <span key={key}>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'middle'}} />} {role.name}</span>
                      {/* <nobr key={key}>{role.name}</nobr> */}
                    </Badge>
                  </>
                )}
              </Group>
              <Space h="md" />
              <Center h={100}>
                <Box>
                  <Text align="center" fw={500} size="xl">{profile.name+' está no Mublin!'}</Text>
                  <Text align="center">Faça login para visualizar o perfil completo ou entrar em contato</Text>
                </Box>
              </Center>
              <Group justify="center">
                <Link to={{ pathname: '/login' }}>
                  <Button color="violet">Fazer login</Button>
                </Link>
                ou
                <Link to={{ pathname: '/signup' }}>
                <Button 
                  color="violet" 
                  variant="outline"
                >Cadastrar</Button>
                </Link>
              </Group>
            </>
          }

          {(!profile.requesting && !profile.id && profile.requested) && 
            <Center h={100} mt='xl'>
              <Box>
                <Title mt='xl'>Ops!</Title>
                <Text mt='xs'>A página ou o perfil não foram encontrados!</Text>
              </Box>
            </Center>
          }

        </Container>
        <Footer />
      </>
    );
};

export default PublicProfilePage;