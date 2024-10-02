import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../../../components/public/header';
import { Footer } from '../../../components/public/footer';
import { 
  Container, Box, Button, Center, 
  Flex, Group, Image, 
  Title, Text, Badge, 
  Skeleton, Space, 
  Pill, Indicator 
} from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { profileInfos } from '../../../store/actions/profile';

function PublicProfilePage () {

    const params = useParams();
    const username = params.username;
    // const loggedIn = useSelector(state => state.authentication.loggedIn);

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
              <Skeleton height={50} circle mb="xl" />
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
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
                pb="md"
              >
                <Image
                  h={140}
                  w="auto"
                  fit="contain"
                  radius="lg"
                  src={profile.pictureLarge}
                  alt={`${profile.name} ${profile.lastname}`} 
                  caption={profile.username}
                />
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
              {profile.bio && <Text>{profile.bio}</Text>}
              <Space h="sm" />
              <Text size="sm" c="dimmed">Instrumentos e habilidades:</Text>
              <Group gap="xs" mb='xl' mt='xs'>
                {profile.roles.map((role, key) =>
                  <Badge color="#d0d4d7" autoContrast key={key}>
                    <nobr key={key}>{role.name}</nobr>
                  </Badge>
                )}
              </Group>
              <Center h={100} mt='xl'>
                <Box>
                  <Text align="center" fw={500} size="xl">{profile.name+' está no Mublin!'}</Text>
                  <Text align="center">Faça login para visualizar o perfil completo</Text>
                </Box>
              </Center>
              <Group justify="center">
                <Button color="violet">Fazer login</Button>
                ou
                <Button color="violet" variant="outline">Cadastrar</Button>
              </Group>
            </>
          }

          {(!profile.requesting && !profile.id) && 
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