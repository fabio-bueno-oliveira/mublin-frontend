import React, { useEffect } from 'react';
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
  Skeleton, Indicator 
} from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react'

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
        <Container size='lg' mb='lg'>
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
                align="center"
                direction="row"
                pt="md"
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
                    h={100}
                    w='auto'
                    fit='contain'
                    radius='lg'
                    src={profile.picture}
                    alt={`Foto de perfil de ${profile.name} ${profile.lastname} no Mublin`} 
                    fallbackSrc='https://placehold.co/100x100?text=Placeholder'
                  />
                )}
                <Box>
                  <Text size='md' fw={500} className='lhNormal'>
                    {username}
                  </Text>
                  <Group gap='xs'>
                    {profile.roles.map(role =>
                      <Box key={role.id}>
                        <Badge size='xs' color='#d0d4d7' autoContrast>
                          <span>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'middle'}} />} {role.name}</span>
                          {/* <nobr >{role.name}</nobr> */}
                        </Badge>
                      </Box>
                    )}
                  </Group>
                  <Group gap="xs">
                    <Text size="xs">{`${profile?.followers?.total} seguidores`}</Text>
                    <Text size="xs">{`${profile?.following?.total} seguindo`}</Text>
                    <Text size="xs">{profile?.projects?.total} {profile?.projects?.total === 1 ? 'projeto' : 'projetos'}</Text>
                  </Group>
                  {profile.city && 
                    <Flex gap={2} align='center'>
                      <IconMapPin size={13} style={{color:'#8d8d8d'}} />
                      <Text c='dimmed' size='10px'>
                        {profile.city}, {profile.region}, {profile.country}
                      </Text>
                    </Flex>
                  }
                  <Flex
                    align='center'
                    justify='flex-start'
                    gap={3}
                    mt={4}
                  >
                    <Indicator
                      inline
                      processing={profile.availabilityId === 1}
                      color={profile.availabilityColor}
                      size={8}
                      ml={4}
                      mr={7}
                    />
                    <Text
                      fz='xs'
                      fw='490'
                      className='lhNormal'
                      pt='1px'
                    >
                      {profile.availabilityTitle}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              {(profile.bio && profile.bio !== "null") && 
                <Text size='sm' style={{lineHeight:'1.24em',whiteSpace:'pre-wrap'}}>
                  {profile.bio}
                </Text>
              }
              <Center h={100}>
                <Box>
                  <Text align="center" fw={500} size="xl">
                    {`${profile.name} ${profile.lastname} está no Mublin!`}
                  </Text>
                  <Text align="center">
                    Faça login para visualizar o perfil completo ou entrar em contato
                  </Text>
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