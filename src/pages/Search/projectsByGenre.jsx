import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { searchInfos } from '../../store/actions/search'
import { Container, Grid, Flex, Skeleton, Box, Title, Text, BackgroundImage, Avatar, Anchor, em } from '@mantine/core'
import { useMediaQuery, useFetch } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'

function SearchProjectsByGenre () {

  const dispatch = useDispatch()
  const params = useParams()
  const genreId = params?.genreId

  const searchResults = useSelector(state => state.search)

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const { data, loading } = useFetch(
    'https://mublin.herokuapp.com/music/genre/20'
  );

  useEffect(() => {
    dispatch(searchInfos.getFeaturedGenres())
    dispatch(searchInfos.getProjectsByGenre(genreId))
  }, [dispatch])

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
      <Helmet>
        <meta charSet='utf-8' />
        <title>{data?.name ? `${data?.name} | Mublin` : `Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/search/projects/genre/${genreId}`} />
      </Helmet>
      {isLargeScreen && 
        <Header page='search' hasBottomSpace />
      }
      <Container size={'lg'} mb={isLargeScreen ? 30 : 82} mt={isMobile ? 16 : 0}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
            <Title order={1} size="h3" mb={14}>
              {loading ? 'Carregando...' : `Projetos de ${data?.name}`}
            </Title>
            {searchResults.requesting ? ( 
              skeletonLoadingResult
            ) : (
              <>
                {searchResults.projectsByGenre.total ? (
                  searchResults.projectsByGenre.result.map(project => 
                    <Flex 
                      key={project.id} 
                      align='center' 
                      mb={13} 
                      gap={6} 
                      justify='space-between'
                    >
                      <Avatar 
                        src={project.picture ? project.picture : undefined} 
                        size='lg'
                        component='a'
                        href={`/project/${project.username}`}
                      />
                      <Flex
                        justify='flex-start'
                        align='flex-start'
                        direction='column'
                        wrap='wrap'
                        style={{flexGrow:'2'}}
                      >
                        <Anchor href={`/project/${project.username}`}>
                          <Text size='md' fw={600} className='lhNormal'>
                            {project.name}
                          </Text>
                        </Anchor>
                        <Text size='sm'>
                          {project.type}
                        </Text>
                        <Text size='xs' fw={300} c='dimmed'>
                          {project.city && project.city+' - '+project.region}
                        </Text>
                      </Flex>
                    </Flex>
                  )
                ) : (
                  <Text size='sm' c='dimmed'>Nenhum projeto encontrado</Text>
                )}
              </>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <Title fz='1.03rem' fw='640' mb={14}>
              Encontre projetos por gênero
            </Title>
            <Grid mb={36}>
              {searchResults.featuredGenres.map(genre => (
                <Grid.Col p={4} span={{ base: 4, md: 6, lg: 6 }} key={genre.id}>
                  <BackgroundImage
                    src="https://ik.imagekit.io/mublin/misc/music/duotone/rehearsalb_DRyoWy2aE.png?updatedAt=1599615974997"
                    radius="lg"
                    w='100%'
                    h={85}
                    p={10}
                    component='a'
                    href={`/search/projects/genre/${genre.id}`}
                  >
                    <Box w={85}>
                      <Text 
                        c='white' 
                        size='sm' 
                        fw={500} 
                        truncate="end" 
                        style={{textWrap:'unset'}}
                        title={genre.name}
                      >
                        {genre.name}
                      </Text>
                    </Box>
                  </BackgroundImage>
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SearchProjectsByGenre