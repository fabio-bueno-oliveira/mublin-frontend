import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { jobsActions } from '../../store/actions/jobs'
import { Container, Grid, Flex, Box, Title, Text, NativeSelect, Card, Loader, Center, Image, Avatar, Anchor, Badge } from '@mantine/core';
import { useDocumentTitle, useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'

function MyProjects () {

  useDocumentTitle('Vagas | Mublin')

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  
  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)
  const jobs = useSelector(state => state.jobs)

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUserId))
    dispatch(jobsActions.getJobs())
  }, [userInfo.id, dispatch])

  const projectsList = projects?.listBasicInfo.map(project => ({
    value: String(project.username),
    label: project.name
  }))

  return (
    <>
      <Helmet>
        <title>Meus projetos | Mublin</title>
        <link rel='canonical' href='https://mublin.com/projects' />
      </Helmet>
      <Header page='myProjects' reloadUserInfo />
      <Container
        size='lg'
        mb={isLargeScreen ? 30 : 82}
        pt={isLargeScreen ? 20 : 0}
        className='myProjectsPage'
      >
        <NativeSelect
          size='lg'
          mb={20}
          placeholder='Escolha um projeto'
          onChange={(e) => navigate(`/project/${e.currentTarget.value}`)}
        >
          {projects.requesting ? (
            <option value=''>Carregando meus projetos...</option>
          ) : (
            <option value=''>Selecione um dos seus projetos</option>
          )}
          {!projects.requesting && projectsList.map(project =>
            <option key={project.value} value={project.value}>
              {project.label}
            </option>
          )}
        </NativeSelect>
        <Grid mt={30}>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className='showOnlyInLargeScreen'>
            <Card
              padding={12}
              radius='lg'
              withBorder
              className='mublinModule'
              mb='10'
            >
              <Card.Section>
                <Image
                  src={userInfo.picture_cover ? `https://ik.imagekit.io/mublin/tr:h-200,c-maintain_ratio/users/avatars/${userInfo.picture_cover}` : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'} 
                  height={70}
                  alt={`Imagem de capa de ${userInfo.name}`}
                />
              </Card.Section>
              <Center style={{marginTop:'-20px'}}>
                <Avatar
                  size='80px'
                  src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-152,w-152,c-maintain_ratio/users/avatars/'+userInfo.picture : undefined}
                  style={{border:'2px solid white'}}
                />
              </Center>
              <Text size='lg' fw={600} mt={10} ta='center' className='lhNormal'>
                {userInfo.name} {userInfo.lastname}
              </Text>
              <Text
                ta='center'
                c='dimmed'
                fw='400'
                fz='xs'
                mb={8}
                className='lhNormal'
              >
                {user.roles.map(role => 
                  <span className='comma' key={role.id}>{role.description}</span>
                )}
              </Text>
              {user.plan === 'Pro' ? ( 
                <Center>
                  <Badge
                    title='Usuário PRO'
                    radius='sm'
                    size='sm'
                    variant="gradient"
                    gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                  >
                    PRO
                  </Badge>
                </Center>
              ) : (
                <Center>
                  <Anchor
                    variant='gradient'
                    gradient={{ from: 'violet', to: 'blue' }}
                    fw='420'
                    fz='xs'
                    href='/pro'
                    underline='hover'
                  >
                    Assine o Mublin PRO!
                  </Anchor>
                </Center>
              )}
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }} pb={40}>
            <Title fz='1.2rem' fw='600'>
              Ou busque vagas em novas gigs
            </Title>
            <Text size='sm' c='dimmed'>Listamos algumas vagas pra você</Text>
            {jobs.requesting ? (
              <Center mt={30}>
                <Loader color='mublinColor' />
              </Center>
            ) : (
              <>
                {jobs.list.map(job =>
                  <Card 
                    key={job.id}
                    px={12} 
                    py={8} 
                    mt={22}
                    radius='md' 
                    className='mublinModule' 
                    withBorder 
                  >
                    <Flex gap={10}>
                      <Image 
                        src={`https://ik.imagekit.io/mublin/projects/tr:h-120,w-120,c-maintain_ratio/${job.projectPicture}`} 
                        radius='sm'
                        width={60} 
                        height={60} 
                      />
                      <Box>
                        <Anchor 
                          href={`/job?id=${job.id}`}
                          underline='hover'
                          className='textLink'
                        >
                        <Title order={2} fz='0.95rem' fw={550}>
                          {job.roleName} em {job.projectName} ({job.projectType})
                        </Title>
                        </Anchor>
                        <Text size='xs' c='dimmed'>
                          Experiência: Nível {job.experiencePTBR}
                        </Text>
                        <Text size='11px' mt={2}>
                          Oportunidade para tocar em {job.opportunityCityName} · {job.opportunityRegionName} · {job.opportunityCityCountry}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                )}
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default MyProjects