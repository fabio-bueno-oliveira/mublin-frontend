import React, { useEffect, useState } from 'react';
import { useSearchParams, createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Container, Flex, Tabs, Box, Text, Avatar, Input, Center, Loader, Badge, rem, em } from '@mantine/core';
import { IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconSearch } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import UserCard from '../../components/userCard';

function Search () {

  // const loggedUser = JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  const searchResults = useSelector(state => state.search);
  // const suggestedUsers = useSelector(state => state.search.suggestedUsers);

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [showMobileMenu, setShowMobileMenu] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchedKeywords);

  const handleChangeSearch = (e, query, tab) => {
    setSearchQuery(query);
    autoSearch(e, query, tab);
  }

  const autoSearch = useDebouncedCallback(async (e, query, tab) => {
      handleSearch(e, query, tab);
  },430);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchedKeywords) {
      dispatch(searchInfos.getSearchUsersResults(searchedKeywords));
      dispatch(searchInfos.getSearchProjectsResults(searchedKeywords));
    }
    dispatch(searchInfos.getSuggestedFeaturedUsers());
    // dispatch(searchInfos.getSuggestedUsersResults());
    // dispatch(miscInfos.getFeed());
  }, [dispatch, searchedKeywords]);

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
      <Header pageType='search' />
      <Container size={'lg'} mb={largeScreen ? 30 : 82}>
        {isMobile && 
          <form
            onSubmit={(e) => handleSearch(e, searchQuery, null)}
            onFocus={() => setShowMobileMenu(false)}
            onBlur={() => setShowMobileMenu(true)}
          >
            <Input 
              variant='filled'
              size='md'
              w={"100%"}
              mb={14}
              placeholder='Pessoa, instrumento ou cidade...'
              value={searchQuery ? searchQuery : undefined}
              // onChange={(event) => setSearchQuery(event.currentTarget.value)}
              onChange={(event) => handleChangeSearch(
                event, event.currentTarget.value, null
              )}
              leftSection={<IconSearch size={16} />}
            />
          </form>
        }
        {!searchedKeywords && 
          <>
            <Text fw={700} size="md">Músicos em destaque</Text>
            {searchResults.requesting ? (
              <Text size="13px" mt={7}>Carregando...</Text>
            ) : (
              searchResults.suggestedFeaturedUsers.map((user, key) => (
                <UserCard 
                  mt={6}
                  key={key}
                  name={user.name}
                  lastname={user.lastname}
                  username={user.username}
                  mainRole={user.role}
                  picture={user.picture}
                  verified={user.verified}
                  legend={user.legend}
                  city={user.city}
                  region={user.region}
                />
              ))
            )}
            {/* <Text fw={700} size="md" mt={16}>Sugestões para conectar</Text>
            {searchResults.requesting ? (
              <Group justify='flex-start'>
                <Skeleton height={50} width={50} />
                <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                  <Skeleton height={9} width={300} radius="xl" />
                  <Skeleton height={9} width={300} radius="xl" />
                  <Skeleton height={9} width={300} radius="xl" />
                </SimpleGrid>
              </Group>
            ) : (
              suggestedUsers.map((user, key) =>
                <UserCard 
                  mt={6}
                  key={key}
                  name={user.name}
                  lastname={user.lastname}
                  username={user.username}
                  mainRole={user.role}
                  picture={user.picture}
                  verified={user.verified}
                  legend={user.legend}
                  city={user.city}
                  region={user.region}
                />
              )
            )} */}
          </>
        }
        {searchResults.requesting && 
          <Center>
            <Loader  mt={76} size={50} color="violet" />
          </Center>
        }
        {(searchedKeywords && !searchResults.requesting) && 
          <Tabs defaultValue="people" orientation="horizontal" color="violet">
            <Tabs.List>
              <Tabs.Tab value="people" mb={15}>
                {searchResults.users[0].id
                  ?  'Pessoas ('+searchResults.users.length+')' 
                  : 'Pessoas (0)'
                }
              </Tabs.Tab>
              <Tabs.Tab value="projects" mb={15}>
                {`Projetos (${searchResults.projects.total})`}
              </Tabs.Tab>
              {/* <Tabs.Tab value="gear">
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
                          <Link to={{ pathname: `/${user.username}` }} className="textLink">
                            <Flex gap={3} align={'center'}>
                              <Text size='sm' fw={500}>
                                {user.name+' '+user.lastname}
                              </Text>
                              {!!user.verified && 
                                <IconRosetteDiscountCheckFilled color='blue' 
                                style={iconVerifiedStyle} />
                              }
                              {!!user.legend && 
                                <IconShieldCheckFilled color='#DAA520' 
                                style={iconVerifiedStyle} />
                              }
                            </Flex>
                          </Link>
                          <Text size='xs'>
                            {user.mainRole ? user.mainRole : user.bio}
                          </Text>
                          <Text size='10px' c='dimmed'>
                            {user.city && user.city+' - '+user.region}
                          </Text>
                          {user.projectRelated && 
                            <Text size='10px' mt="3px">
                              Projeto relacionado: {user.projectRelated} ({user.projectType})
                            </Text>
                          }
                        </Flex>
                      </Flex>
                      {/* <Divider my="xs" /> */}
                    </>
                  )}
                </Box>
              }
            </Tabs.Panel>
            <Tabs.Panel value="projects" pl={10}>
              {searchResults.projects.total && 
                <Box>
                  {searchResults.projects.result.map((project, key) => 
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
                          <Link to={{ pathname: `/project/${project.username}` }} className="textLink">
                            <Text size='sm' fw={500}>
                              {project.name} 
                            </Text>
                          </Link>
                          {(project.labelShow && project.labelText) && 
                            <Badge 
                              color={project.labelColor} 
                              size="xs" 
                              radius="sm" 
                              variant="filled"
                            >
                              {project.labelText}
                            </Badge>
                          }
                          <Text size='xs'>
                            {project.type} · {project.mainGenre}
                          </Text>
                          <Text size='10px' c='dimmed'>
                            {project.city && project.city+' - '+project.region}
                          </Text>
                        </Flex>
                      </Flex>
                      {/* <Divider my="xs" /> */}
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