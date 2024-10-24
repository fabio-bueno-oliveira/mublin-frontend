import React, { useEffect, useState } from 'react';
import { useSearchParams, createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Container, Grid, Flex, Group, Skeleton, SimpleGrid, Divider, Tabs, Box, Title, Card, Text, Image, Badge, Avatar, Input, ActionIcon, Center, Loader, rem } from '@mantine/core';
import { IconPlaylist, IconBox, IconUsers, IconRosetteDiscountCheckFilled, IconSearch } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function Search () {

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  const searchResults = useSelector(state => state.search);
  const suggestedUsers = useSelector(state => state.search.suggestedUsers);
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const [searchQuery, setSearchQuery] = useState(searchedKeywords);
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(searchInfos.getSearchUsersResults(searchedKeywords));
    dispatch(searchInfos.getSearchProjectsResults(searchedKeywords));
    dispatch(searchInfos.getSuggestedUsersResults());
    // dispatch(miscInfos.getFeed());
  }, [dispatch, searchedKeywords]);

  const iconStyle = { width: rem(12), height: rem(12) };
  const iconVerifiedStyle = { width: rem(15), height: rem(15) };

  const handleSearch = (e, query, tab) => {
    e.preventDefault();
    navigate({
      pathname: '/search',
      search: createSearchParams({
        keywords: query ? query : '',
        tab: tab ? tab : ''
      }).toString()
    });
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mb={largeScreen ? 30 : 82}>
        {!largeScreen && 
          <Group mb={20} gap={2}>
            <form
              onSubmit={(e) => handleSearch(e, searchQuery, null)}
              onFocus={() => setShowMobileMenu(false)}
              onBlur={() => setShowMobileMenu(true)}
            >
              <Input 
                variant="filled" 
                size="sm"
                w={'250px'}
                placeholder='Pessoa, instrumento ou cidade'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                rightSectionPointerEvents="all"
              />
            </form>
            <ActionIcon 
              c='dimmed' variant="transparent" aria-label="Buscar"
              onClick={(e) => handleSearch(e, searchQuery, null)}
            >
              <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Group>
        }
        <Box mb={14}>
          <Title order={4}>{!searchedKeywords ? 'Sugestões para se conectar' : 'Resultados da pesquisa por "'+searchedKeywords+'"'}</Title>
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
        {searchResults.requesting && 
          <Center><Loader  mt={76} size={50} color="violet" /></Center>
        }
        {(searchedKeywords && !searchResults.requesting) && 
          <Tabs defaultValue="people" orientation="vertical" >
            <Tabs.List>
              <Tabs.Tab value="people" p={4} mb={15}>
                {searchResults.users[0].id
                  ?  'Pessoas ('+searchResults.users.length+')' 
                  : 'Pessoas (0)'
                }
              </Tabs.Tab>
              <Tabs.Tab value="projects" p={4} mb={15}>
                {searchResults.projects[0].id 
                  ? 'Projetos ('+searchResults.projects.length+')' 
                  : 'Projetos (0)'
                }
              </Tabs.Tab>
              {/* <Tabs.Tab value="gear" p={3}>
                Equipamentos
              </Tabs.Tab> */}
            </Tabs.List>
            <Tabs.Panel value="people" pl={10}>
              {searchResults.users[0].id && 
                <Box>
                  {searchResults.users.map((user, key) =>
                    <>
                      <Flex align={'center'} key={key} mb={8} gap={6}>
                        <Link to={{ pathname: `/${user.username}` }}>
                          <Avatar 
                            src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} 
                            size='md'
                          />
                        </Link>
                        <Flex
                          justify="flex-start"
                          align="flex-start"
                          direction="column"
                          wrap="wrap"
                        >
                          <Flex gap={3}>
                            <Text size='xs' fw={500}>
                              {user.name+' '+user.lastname}
                            </Text>
                            {!!user.verified && 
                              <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                            }
                          </Flex>
                          <Text size='11px'>
                            {user.mainRole ? user.mainRole : user.bio}
                          </Text>
                          <Text size='11px' c='dimmed'>
                            {user.city && user.city+' - '+user.region}
                          </Text>
                        </Flex>
                      </Flex>
                      <Divider my="xs" />
                    </>
                  )}
                </Box>
              }
            </Tabs.Panel>
            <Tabs.Panel value="projects" pl={10}>
              {searchResults.users[0].id && 
                <Box>
                  {searchResults.projects.map((project, key) => 
                    <>
                      <Flex align={'center'} key={key} mb={8} gap={6}>
                        <Link to={{ pathname: `/project/${project.username}` }}>
                          <Avatar 
                            src={project.picture ? project.picture : undefined} 
                            size='md'
                          />
                        </Link>
                        <Flex
                          justify="flex-start"
                          align="flex-start"
                          direction="column"
                          wrap="wrap"
                        >
                          <Text size='xs' fw={500}>
                            {project.name}
                          </Text>
                          <Text size='11px'>
                            {project.type} · {project.mainGenre}
                          </Text>
                          <Text size='11px' c='dimmed'>
                            {project.city && project.city+' - '+project.region}
                          </Text>
                        </Flex>
                      </Flex>
                      <Divider my="xs" />
                    </>
                  )}
                </Box>
              }
            </Tabs.Panel>
            {/* <Tabs.Panel value="gear">
              Equipamentos tab content
            </Tabs.Panel> */}
          </Tabs>
        }
      </Container>
      {showMobileMenu && 
        <FooterMenuMobile />
      }
    </>
  );
};

export default Search;