import React, { useEffect, useState } from 'react';
import { useSearchParams, createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Container, Grid, Group, Flex, Skeleton, Box, Title, Text, Anchor, Avatar, Image, Input, CloseButton, Divider, Indicator, rem, em } from '@mantine/core';
import { IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconSearch, IconUsers } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import UserCard from '../../components/userCard';
import ProjectCard from '../../components/projectCard';

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
      dispatch(searchInfos.getSearchGearResults(searchedKeywords));
      dispatch(searchInfos.getSearchBrandsResults(searchedKeywords));
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

  const skeletonLoadingResult = <Flex gap={6} align='center'>
    <Skeleton height={56} circle />
    <Flex direction='column'>
      <Box w={170}>
        <Skeleton height={10} width={160} radius='xl' mb={7} />
        <Skeleton height={10} width={110} radius='xl' />
      </Box>
    </Flex>
  </Flex>

  return (
    <>
      {isLargeScreen && 
        <Header page='search' />
      }
      <Container size={'lg'} mb={isLargeScreen ? 30 : 82} mt={isMobile ? 16 : 30}>
        {isMobile && 
          <form
            onSubmit={(e) => handleSearch(e, searchQuery, null)}
            onFocus={() => setShowMobileMenu(false)}
            onBlur={() => setShowMobileMenu(true)}
          >
            <Input 
              variant='filled'
              size='lg'
              w={"100%"}
              mb={14}
              placeholder='Pessoa, instrumento, cidade...'
              value={searchQuery}
              onChange={(event) => handleChangeSearch(
                event, event.currentTarget.value, null
              )}
              leftSection={<IconSearch size={16} />}
              rightSectionPointerEvents='all'
              rightSection={
                <CloseButton
                  aria-label='Apagar'
                  onClick={(event) => handleChangeSearch(
                    event, '', null
                  )}
                  style={{ display: searchQuery ? undefined : 'none' }}
                />
              }
            />
          </form>
        }
        {(!searchedKeywords && !searchResults.requesting) && 
          <>
          <Grid>
            <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
              <Title fz='1.03rem' fw='640' mb={14}>
                Músicos em destaque
              </Title>
              {searchResults.suggestedFeaturedUsers.map(user => (
                <UserCard 
                  key={user.id}
                  mt={0}
                  mb={14}
                  size='lg'
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
              ))}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Title fz='1.03rem' fw='640' mb={14}>
                Projetos em destaque
              </Title>
              {searchResults.featuredProjects.result.map((project, index) => (
                <ProjectCard 
                  mb={14}
                  key={index}
                  size='md'
                  picture={project.picture}
                  isPictureFullUrl={true}
                  name={project.name}
                  username={project.username}
                  type={project.type}
                  city={project.city}
                  region={project.region}
                  confirmed={undefined}
                  genre={project.genre1}
                />
              ))}
            </Grid.Col>
          </Grid>
          </>
        }
        {searchedKeywords && 
          <Grid>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }} pr={10}>
              <Title order={5} fw={650} mb={11}>
                {`Pessoas (${searchResults.users.total})`}
              </Title>
              {searchResults.requesting ? ( 
                skeletonLoadingResult
              ) : (
                searchResults.users.total ? (
                  searchResults.users.result.map(user =>
                    <Flex key={user.id} align='flex-start' mb={13} gap={6}justify='space-between'>
                      <Link to={{ pathname: `/${user.username}` }}>
                        <Indicator position='bottom-center' inline label={<Text size='0.6rem' >Bora Play!!</Text>} color='lime' size={18} withBorder disabled={!user.openToWork}>
                          <Avatar
                            src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'}
                            size='lg'
                          />
                        </Indicator>
                      </Link>
                      <Flex
                        justify='flex-start'
                        align='flex-start'
                        direction='column'
                        wrap='wrap'
                        style={{flexGrow:'2'}}
                      >
                        <Anchor href={`/${user.username}`}>
                          <Flex gap={3} align={'center'}>
                            <Text size='0.97rem' fw={570} className='lhNormal'>
                              {user.name+' '+user.lastname}
                            </Text>
                            {!!user.verified && 
                              <IconRosetteDiscountCheckFilled color='#0977ff' title='Usuário verificado' 
                              style={iconVerifiedStyle} />
                            }
                            {!!user.legend && 
                              <IconShieldCheckFilled color='#DAA520' title='Lenda da música' 
                              style={iconVerifiedStyle} />
                            }
                          </Flex>
                        </Anchor>
                        <Text size='xs' fw={400}>
                          {user.mainRole && user.mainRole} {!!user.totalProjects && ` • ${user.totalProjects} projetos ativos`}
                        </Text>
                        <Text size='xs' fw={400} c='dimmed'>
                          {user.city && user.city+' - '+user.region}
                        </Text>
                        {(user.projectRelated && !user?.projectRelated?.includes(user.name) && !searchedKeywords.includes(user.name.toLowerCase()) && !searchedKeywords.includes(user.lastname.toLowerCase())) && 
                          <Text size='10px' mt='3px' c='dimmed'>
                            Relacionado: {user.projectRelated} ({user.projectType})
                          </Text>
                        }
                      </Flex>
                    </Flex>
                  )
                ) : (
                  <Text size='sm' c='dimmed'>Nenhum resultado encontrado</Text>
                )
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Title order={5} fw={650} mb={11}>
                {`Projetos (${searchResults.projects.total})`}
              </Title>
              {searchResults.requesting ? ( 
                skeletonLoadingResult
              ) : (
                searchResults.projects.total ? (
                  searchResults.projects.result.map(project => 
                    <Flex key={project.id} align='flex-start' mb={13} gap={6} justify='space-between'>
                      <Link to={{ pathname: `/${project.username}` }}>
                        <Avatar 
                          src={project.picture ? project.picture : undefined} 
                          size='lg'
                        />
                      </Link>
                      <Flex
                        justify='flex-start'
                        align='flex-start'
                        direction='column'
                        wrap='wrap'
                        style={{flexGrow:'2'}}
                      >
                        <Anchor href={`/${project.username}`}>
                          <Flex gap={3} align={'center'}>
                            <Text size='0.97rem' fw={570} className='lhNormal'>
                              {project.name}
                            </Text>
                          </Flex>
                        </Anchor>
                        <Text size='xs' fw={300}>
                          {project.type}{project.mainGenre && ` · ${project.mainGenre}`}
                        </Text>
                        {/* <Text size='xs' fw={300} c='dimmed'>
                          {project.city && project.city+' - '+project.region}
                        </Text> */}
                        {(project.relatedUserName.toLowerCase() === searchedKeywords.toLowerCase() || project.relatedUserLastname.toLowerCase() === searchedKeywords.toLowerCase() || project.relatedUserUsername.toLowerCase() === searchedKeywords.toLowerCase() || `${project.relatedUserName.toLowerCase()} ${project.relatedUserLastname.toLowerCase()}` === searchedKeywords.toLowerCase()) && 
                          <Group gap={3} mt={2}>
                            <Link to={{ pathname: `/${project.relatedUserUsername}` }}>
                              <Avatar 
                                src={project.relatedUserPicture ? `https://ik.imagekit.io/mublin/users/avatars/tr:h-30,w-30,c-maintain_ratio/${project.relatedUserId}/${project.relatedUserPicture}` : undefined} 
                                size='15px'
                              />
                            </Link>
                            <Text size='0.7rem' fw={400} c='dimmed' className='lhNormal'>
                              {project.relatedUserName} {project.relatedUserLastname}
                            </Text>
                          </Group>
                        }
                      </Flex>
                    </Flex>
                  )
                ) : (
                  <Text size='sm' c='dimmed'>Nenhum projeto encontrado</Text>
                )
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Title order={5} fw={650} mb={11}>
                Equipamento
              </Title>
              {searchResults.brands.total > 0 && (
                <>
                  <Divider
                    mb='xs'
                    variant='dashed'
                    labelPosition='left'
                    label={
                      <>
                        <IconSearch size={12} />
                        <Box ml={5}>{searchResults.brands.total} marcas relacionadas:</Box>
                      </>
                    }
                  />
                  {searchResults.brands.result.map(brand => 
                    <Flex key={brand.id} align='center' mb={8} gap={8}>
                      <Link to={{ pathname: `/gear/brand/${brand.slug}` }}>
                        <Image
                          src={brand.logo ? `https://ik.imagekit.io/mublin/products/brands/tr:w-112,h-112,cm-pad_resize,bg-FFFFFF,fo-x/${brand.logo}` : undefined}
                          h={56}
                          w='auto'
                          fit='contain'
                          radius='xl'
                        />
                      </Link>
                      <Flex
                        justify='flex-start'
                        align='flex-start'
                        direction='column'
                        wrap='wrap'
                      >
                        <Anchor href={`/gear/brand/${brand.slug}`}>
                          <Flex gap={3} align={'center'}>
                            <Text size='0.97rem' fw={570} className='lhNormal'>
                              {brand.name}
                            </Text>
                          </Flex>
                        </Anchor>
                      </Flex>
                    </Flex>
                  )}
                </>
              )}
              {searchResults.requesting ? ( 
                skeletonLoadingResult
              ) : (
                searchResults.gear.total ? (
                  <>
                    <Divider
                      mb='xs'
                      variant='dashed'
                      labelPosition='left'
                      label={
                        <>
                          <IconSearch size={12} />
                          <Box ml={5}>{searchResults.gear.total} itens encontrados:</Box>
                        </>
                      }
                    />
                    {searchResults.gear.result.map(product => 
                      <Flex key={product.productId} align='flex-start' mb={10} gap={7} justify='space-between'>
                        <Link to={{ pathname: `/gear/product/${product.productId}` }}>
                          <Image
                            src={product.productPicture ? `https://ik.imagekit.io/mublin/products/tr:w-112,h-112,cm-pad_resize,bg-FFFFFF,fo-x/${product.productPicture}` : undefined}
                            h={56}
                            mah={56}
                            w='auto'
                            fit='contain'
                            mb={10}
                            radius='md'
                          />
                        </Link>
                        <Flex
                          justify="flex-start"
                          align="flex-start"
                          direction="column"
                          wrap="wrap"
                          style={{flexGrow:'2'}}
                        >
                          <Anchor href={`/gear/product/${product.productId}`}>
                            <Flex gap={3} align={'center'}>
                              <Text size='0.97rem' fw={570} className='lhNormal'>
                                {product.productName}
                              </Text>
                            </Flex>
                          </Anchor>
                          <Text size='xs' fw={300}>
                            {product.name_ptbr} • <a className='textLink' href={`/gear/brand/${product.brandSlug}`}>{product.brand}</a>
                          </Text>
                          <Flex gap={3} mt={4} align='center' justify='space-between' title={product.totalOwners + ' possuem este item'}>
                            <IconUsers style={{width:'12px',height:'12px'}} color='gray' />
                            <Text size='11px' fw={300} c='dimmed' className='lhNormal'>
                              {product.totalOwners}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    )}
                  </>
                ) : (
                  <Text size='sm' c='dimmed'>Nenhum item encontrado</Text>
                )
              )}
            </Grid.Col>
          </Grid>
        }
      </Container>
      {showMobileMenu && 
        <FooterMenuMobile />
      }
    </>
  );
};

export default Search;