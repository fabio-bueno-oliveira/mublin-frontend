import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { profileInfos } from '../../../store/actions/profile'
import { Timeline, Container, Group, Flex, Box, Center, Title, Text, Avatar, Indicator, Tooltip, Anchor, Loader, Skeleton, em } from '@mantine/core'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconArrowLeft, IconSparkles } from '@tabler/icons-react'
import Header from '../../../components/header'
import FloaterHeader from '../floaterHeader'

function ProjectsTimeline () {

  const dispatch = useDispatch()
  const params = useParams()
  const username = params?.username

  useEffect(() => {
      dispatch(profileInfos.getProfileInfo(username))
      dispatch(profileInfos.getProfileProjects(username))
  }, [username])

  const profile = useSelector(state => state.profile)

  const projects = useSelector(state => state.profile.projects.result.sort((a, b) => b.joined_in - a.joined_in))

  const currentYear = new Date().getFullYear()

  const showYears = (years) => {
    if (years > 0) {
        return years === 1 ? '(1 ano)' : '('+years+' anos)'
    } else {
        return '(menos de 1 ano)'
    }
  }

  return (
    <>
      <Header
        page='profile'
        username={username}
        profileId={profile.id}
        showBackIcon={true}
      />
      {(profile.id) &&
        <FloaterHeader profile={profile} scrollY={scroll.y} />
      }
      <Container size='lg' my={14}>
        {profile.requesting ? (
          <Flex gap={10} align='center'>
            <Skeleton h={60} w={60} circle />
            <Flex direction='column'>
              <Skeleton width={100} height={18} radius='xl' />
              <Skeleton width={150} height={12} mt={4} radius='xl' />
            </Flex>
          </Flex>
        ) : (
          <Flex gap={10} align='center'>
            <Avatar
              size='lg'
              src={profile.picture ? profile.picture : undefined}
              onClick={() => navigate(`/${username}`)}
              className='point'
            />
            <Box>
              <Flex align='center'>
                <Title fz='1.30rem' fw='600'>
                  {profile.name} {profile.lastname}
                </Title>
                {!!profile.verified && 
                  <Tooltip label='Usuário Verificado'>
                    <IconRosetteDiscountCheckFilled 
                      className='iconVerified'
                      onClick={() => setModalVerifiedOpen(true)}
                    />
                  </Tooltip>
                }
                {!!profile.legend && 
                  <Tooltip label='Lenda da Música'>
                    <IconShieldCheckFilled
                      className='iconLegend'
                      onClick={() => setModalLegendOpen(true)}
                    />
                  </Tooltip>
                }
              </Flex>
              <Text size='sm'>
                Timeline de projetos
              </Text>
              <Anchor 
                href={`/${username}`}
                underline='never'
                className='websiteLink'
                visibleFrom='md'
              >
                <Group gap={3}>
                  <IconArrowLeft size={13}  />
                  <Text size='xs'>Voltar ao perfil</Text>
                </Group>
              </Anchor>
            </Box>
          </Flex>
        )}
      </Container>
      <Container size='lg' mt={30} mb={60}>
        {profile.requesting ? (
          <Center>
            <Loader color='mublinColor' />
          </Center>
        ) : (
          <Center>
            <Timeline bulletSize={24} lineWidth={3}>
              {projects.map(project =>
                <Timeline.Item 
                  key={project.id} 
                  bullet={
                    <Avatar
                      size={25}
                      radius='xl'
                      src={project.picture ? project.picture : undefined}
                      component='a'
                      href={`/project/${project.username}`}
                    />
                  }
                  title={<Text size='14px' fw={550}>Ingressou em {project.name} ({project.type})</Text>}
                >
                  <Text size='xs'>
                    {project.role1} {project.role2 && `, ${project.role2}`}
                  </Text>
                  <Text c='dimmed' size='xs'>
                    Tipo de vínculo: {project.workTitle}
                  </Text>
                  {!project.endYear ? ( 
                    <Flex gap={8} align='center'>
                      <Indicator color={project.left_in ? 'red' : 'green'} size={8} />
                      <Text size='xs' className='lhNormal'>
                        {project.joined_in +' ➜ '+(project.left_in ? project.left_in : 'atualmente')} {project.left_in ? showYears(project.left_in - project.joined_in) : showYears(currentYear - project.joined_in)}
                      </Text>
                    </Flex>
                  ) : (
                    <Flex gap={8} align='center'>
                      <Indicator color='red' size={8} />
                      <Text size='xs' className='lhNormal'>
                        {project.joined_in +' ➜ '+project.endYear} {showYears(project.endYear - project.joined_in)}
                      </Text>
                    </Flex>
                  )}
                </Timeline.Item>
              )}
              <Timeline.Item  title={<Text size='14px' fw={550}>Início</Text>} bullet={<IconSparkles size={12} />}>
                <Text c='dimmed' size='xs'>
                  Início da timeline musical de {username}
                </Text>
                {/* <Text c="dimmed" size="sm">Início da timeline musical</Text>
                <Text size="xs" mt={4}>Data Hora</Text> */}
              </Timeline.Item>
            </Timeline>
          </Center>
        )}
      </Container>
    </>
  )
}

export default ProjectsTimeline