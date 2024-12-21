import React, { useEffect, useState } from 'react';
import { useSearchParams, createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Container, Grid, Flex, Tabs, Box, Title, Text, Anchor, Avatar, Image, Input, CloseButton, Button, Center, Loader, Badge, rem, em } from '@mantine/core';
import { IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconSearch } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function Search () {

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  const searchResults = useSelector(state => state.search);
  // const suggestedUsers = useSelector(state => state.search.suggestedUsers);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const isLargeScreen = useMediaQuery('(min-width: 60em)');

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
    dispatch(searchInfos.getFeaturedProjects());
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
      {isLargeScreen && 
        <Header page='search' />
      }
      <Container size={'lg'} mb={isLargeScreen ? 30 : 82} mt={isMobile ? 6 : 30}>
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
              value={searchQuery}
              onChange={(event) => handleChangeSearch(
                event, event.currentTarget.value, null
              )}
              leftSection={<IconSearch size={16} />}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Apagar"
                  onClick={(event) => handleChangeSearch(
                    event, "", null
                  )}
                  style={{ display: searchQuery ? undefined : 'none' }}
                />
              }
            />
          </form>
        }
        {!searchedKeywords && 
          <Grid>
            <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
              <Title fz='1.14rem' fw={460} className='op80' mb={14}>
                Músicos em destaque
              </Title>
              {searchResults.requesting ? (
                <Text size="13px" mt={7}>Carregando...</Text>
              ) : (
                searchResults.suggestedFeaturedUsers.map((user, key) => (
                  <Flex key={key} align={'center'} mb={13} gap={6} justify="space-between">
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
                      style={{flexGrow:'2'}}
                    >
                      <Anchor href={`/${user.username}`}>
                        <Flex gap={3} align={'center'}>
                          <Text size='md' fw={500} style={{lineHeight:'normal'}}>
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
                      </Anchor>
                      <Text size='0.82rem' mt={1}>
                        {user.role}
                      </Text>
                      <Text size='0.82rem' c='dimmed'>
                        {user.city && user.city+' - '+user.region}
                      </Text>
                      {/* {(user.projectRelated && !user?.projectRelated?.includes(user.name) && !searchedKeywords.includes(user.name) && !searchedKeywords.includes(user.lastname)) && 
                        <Text size='10px' mt='3px' c='dimmed'>
                          Projeto relacionado: {user.projectRelated} ({user.projectType})
                        </Text>
                      } */}
                    </Flex>
                    {/* <Box>
                      <Button 
                        size='sm' 
                        color='violet' 
                        variant='light'
                        component="a"
                        href={`/${user.username}`}
                      >
                        Ver perfil
                      </Button>
                    </Box> */}
                  </Flex>
                ))
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Title fz='1.14rem' fw={460} className='op80' mb={14}>
                Projetos em destaque
              </Title>
              {searchResults.requesting ? (
                <Text size="13px" mt={7}>Carregando...</Text>
              ) : (
                searchResults.featuredProjects.result.map((project, key) => (
                  <Flex key={key} align='flex-start' mb={13} gap={6} justify="space-between">
                    <Link to={{ pathname: `/projects/${project.username}` }}>
                      <Image 
                        radius='md'
                        h={50}
                        w={50}
                        fit='contain'
                        name='🎵'
                        src={project.picture ? project.picture : undefined} 
                      />
                    </Link>
                    <Flex
                      justify="flex-start"
                      align="flex-start"
                      direction="column"
                      wrap="wrap"
                      style={{flexGrow:'2'}}
                      gap={2}
                    >
                      <Anchor href={`/projects/${project.username}`}>
                        <Flex gap={3} align={'center'}>
                          <Box w={isMobile ? 300 : 128}>
                            <Text 
                              size='0.91rem'
                              pt={1}
                              fw={450}
                              style={{lineHeight:'normal'}}
                              truncate='end'
                              title={project.name}
                            >
                              {project.name}
                            </Text>
                          </Box>
                        </Flex>
                      </Anchor>
                      <Text size='0.74rem' fw={350} mt={1}>
                        {project.type}{project.genre1 && ` · ${project.genre1}`}
                      </Text>
                      {project.city && 
                        <Text size='0.7rem' c='dimmed'>
                          {project.city && `${project.city} - ${project.region}`}
                        </Text>
                      }
                    </Flex>
                  </Flex>
                ))
              )}
            </Grid.Col>
          </Grid>
        }
        {searchResults.requesting && 
          <Center>
            <Loader  mt={76} size={50} color="violet" />
          </Center>
        }
        {(searchedKeywords && !searchResults.requesting) && 
          <Tabs defaultValue="people" orientation="horizontal" variant="pills" color="violet">
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
              <Tabs.Tab value="gear" mb={15}>
                Equipamentos
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="people" pl={8} pt={12}>
              {searchResults.users[0].id && 
                <Box>
                  {searchResults.users.map((user, key) =>
                    <Flex key={key} align={'center'} mb={13} gap={6} justify="space-between">
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
                        style={{flexGrow:'2'}}
                      >
                        <Anchor href={`/${user.username}`}>
                          <Flex gap={3} align={'center'}>
                            <Text size='md' fw={500} style={{lineHeight:'normal'}}>
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
                        </Anchor>
                        <Text size='sm'>
                          {user.mainRole ? user.mainRole : user.bio}
                        </Text>
                        <Text size='11px' c='dimmed'>
                          {user.city && user.city+' - '+user.region}
                        </Text>
                        {/* {(user.projectRelated && !user?.projectRelated?.includes(user.name) && !searchedKeywords.includes(user.name) && !searchedKeywords.includes(user.lastname)) && 
                          <Text size='10px' mt='3px' c='dimmed'>
                            Projeto relacionado: {user.projectRelated} ({user.projectType})
                          </Text>
                        } */}
                      </Flex>
                      <Box>
                        <Button 
                          size='sm' 
                          color='violet' 
                          variant='light'
                          component="a"
                          href={`/${user.username}`}
                        >
                          Ver perfil
                        </Button>
                      </Box>
                    </Flex>
                  )}
                </Box>
              }
            </Tabs.Panel>
            <Tabs.Panel value="projects" pl={8} pt={12}>
              {searchResults.projects.total && 
                <Box>
                  {searchResults.projects.result.map((project, key) => 
                    <Flex align='center' key={key} mb={15} gap={6}>
                      <Link to={{ pathname: `/project/${project.username}` }}>
                        <Avatar 
                          src={project.picture ? project.picture : undefined} 
                          size='lg'
                        />
                      </Link>
                      <Flex
                        justify="flex-start"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                      >
                        <Link to={{ pathname: `/project/${project.username}` }} className="textLink">
                          <Text size='md' fw={500}>
                            {project.name} 
                          </Text>
                        </Link>
                        {!!(project.labelShow && project.labelText) && 
                          <Badge 
                            color={project.labelColor} 
                            size="xs" 
                            radius="lg" 
                            variant="filled"
                          >
                            {project.labelText}
                          </Badge>
                        }
                        <Text size='sm'>
                          {project.type} · {project.mainGenre}
                        </Text>
                        <Text size='11px' c='dimmed'>
                          {project.city && project.city+' - '+project.region}
                        </Text>
                      </Flex>
                    </Flex>
                  )}
                </Box>
              }
            </Tabs.Panel>
            <Tabs.Panel value="gear" pl={10}>
              <Box>
                Equipamentos
              </Box>
            </Tabs.Panel>
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