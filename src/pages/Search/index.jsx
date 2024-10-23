import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Container, Grid, Flex, Group, Skeleton, SimpleGrid, Divider, Tabs, Box, Title, Card, Text, Image, Badge, Avatar, rem } from '@mantine/core';
import { IconPlaylist, IconBox, IconUsers, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function Search () {

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  const searchResults = useSelector(state => state.search);
  const suggestedUsers = useSelector(state => state.search.suggestedUsers);
  const largeScreen = useMediaQuery('(min-width: 60em)');

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(searchInfos.getSearchUsersResults(searchedKeywords));
    dispatch(searchInfos.getSearchProjectsResults(searchedKeywords));
    dispatch(searchInfos.getSuggestedUsersResults());
    // dispatch(miscInfos.getFeed());
  }, [dispatch, searchedKeywords]);

  const iconStyle = { width: rem(12), height: rem(12) };
  const iconVerifiedStyle = { width: rem(15), height: rem(15) };

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={4}>Sugestões para se conectar</Title>
        </Box>
        {!searchedKeywords && 
          <>
            {searchResults.requesting ? (
              <>
                <Group justify='flex-start'>
                  <Skeleton height={50} width={50} />
                  <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                    <Skeleton height={9} width={300} radius="xl" />
                    <Skeleton height={9} width={300} radius="xl" />
                    <Skeleton height={9} width={300} radius="xl" />
                  </SimpleGrid>
                </Group>
              </>
            ) : (
              suggestedUsers.map((user, key) =>
                <>
                  <Flex key={key} mb={14} gap={7}>
                    <Link to={{ pathname: `/${user.username}` }}>
                      <Avatar 
                        src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} 
                        size='lg'
                      />
                    </Link>
                    <Flex
                      justify="flex-start"
                      align="flex-start"
                      direction="column"
                      wrap="wrap"
                    >
                      <Text size='sm' fw={500}>
                        {user.name+' '+user.lastname} {!!user.verified && <IconRosetteDiscountCheckFilled color='violet' style={iconVerifiedStyle} />}
                      </Text>
                      <Text size='xs'>
                        {user.mainRole ? user.mainRole : user.bio}
                      </Text>
                      <Text size='11px' c='dimmed'>
                        {user.city && user.city+' - '+user.region}
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider my="xs" />
                </>
              )
            )}
          </>
        }
        {searchedKeywords && 
          <Tabs defaultValue="people">
            <Tabs.List>
              <Tabs.Tab value="people" leftSection={<IconUsers style={iconStyle} />}>
                {searchResults.users[0].id
                  ?  'Pessoas ('+searchResults.users.length+')' 
                  : 'Pessoas (0)'
                }
              </Tabs.Tab>
              <Tabs.Tab value="projects" leftSection={<IconPlaylist style={iconStyle} />}>
                {searchResults.projects[0].id 
                  ? 'Projetos ('+searchResults.projects.length+')' 
                  : 'Projetos (0)'
                }
              </Tabs.Tab>
              <Tabs.Tab value="gear" leftSection={<IconBox style={iconStyle} />}>
                Equipamentos
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="people">
              Pessoas tab content
              <Grid mb={largeScreen ? 30 : 86}>
                {searchResults.users.map((user, key) =>
                  <Grid.Col span={{ base: 12, md: 2, lg: 3 }} key={user.id}>
                    <Card
                      shadow="sm"
                      padding="xl"
                      component="a"
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      key={key}
                    >
                      <Card.Section withBorder inheritPadding py="xs" px="xs">
                        <Image
                          src={user.picture}
                          h={160}
                          alt={user.username}
                        />
                      </Card.Section>
                      <Text fw={500} size="xs" mt="md">
                        {user.name} {user.id !== loggedUser.id ? user.lastname : '(Você)'}
                      </Text>
                      {user.instrumentalist && 
                        <Card.Section withBorder inheritPadding py="xs" px="xs">
                          <span style={{color:'darkgray '}}>{user.mainRole}</span>{user.plan === 'Pro' && <Badge size="tiny" className="ml-1 p-1" style={{cursor:"default"}}>Pro</Badge>}
                        </Card.Section>
                      }
                      {user.city &&
                        <Card.Section withBorder inheritPadding py="xs" px="xs">
                            {user.city+' - '+user.region}
                        </Card.Section>
                      }
                      <Text mt="xs" c="dimmed" size="sm">
                        Please click anywhere on this card to claim your reward, this is not a fraud, trust us
                      </Text>
                    </Card>
                  </Grid.Col>
                )}
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="projects">
              Projetos tab content
              <Grid mb={largeScreen ? 30 : 86}>
                {searchResults.projects.map((project, key) =>
                  <Grid.Col span={{ base: 12, md: 2, lg: 3 }} key={project.id}>
                    <Card
                      shadow="sm"
                      padding="xl"
                      component="a"
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      key={key}
                    >
                      <Card.Section>
                        <Image
                          src={project.picture}
                          h={160}
                          alt="No way!"
                        />
                      </Card.Section>
                
                      <Text fw={500} size="lg" mt="md">
                        {project.name}
                      </Text>
                
                      <Text mt="xs" c="dimmed" size="sm">
                        Please click anywhere on this card to claim your reward, this is not a fraud, trust us
                      </Text>
                    </Card>
                  </Grid.Col>
                )}
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="gear">
              Equipamentos tab content
            </Tabs.Panel>
          </Tabs>
        }
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default Search;