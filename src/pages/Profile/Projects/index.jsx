import React from 'react'
import { Flex, Box, Text, Avatar, Skeleton } from '@mantine/core'
import { IconStarFilled } from '@tabler/icons-react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function Projects (props) {

  const profile = props.profile
  const profilePlan = props.profilePlan
  const showPastProjects = props.showPastProjects

  const requesting = props.requesting

  const projects = profile.projects.result.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 })

  return (
    <>
      {requesting && 
        <Flex gap={22}>
          <Flex gap={6}>
            <Skeleton height={64} width={64} radius='sm'/>
            <Flex direction='column' justify='center'>
              <Skeleton width={90} height={10} radius="lg" mb={5} />
              <Skeleton width={100} height={12} radius="lg" mb={5} />
              <Skeleton width={60} height={8} radius="lg" />
            </Flex>
          </Flex>
          <Flex gap={6}>
            <Skeleton height={64} width={64} radius='sm'/>
            <Flex direction='column' justify='center'>
              <Skeleton width={90} height={10} radius="lg" mb={5} />
              <Skeleton width={100} height={12} radius="lg" mb={5} />
              <Skeleton width={60} height={8} radius="lg" />
            </Flex>
          </Flex>
        </Flex>
      }
      <Splide 
        options={{
          drag: 'free',
          snap: false,
          perPage: 1,
          autoWidth: true,
          arrows: false,
          gap: '16px',
          dots: false,
          pagination: false,
        }}
      >
        {projects
          .filter(
            (project) => { return showPastProjects ? project.left_in || !project.left_in || project.endYear || !project.endYear : !project.left_in && !project.endYear }
          )
          .splice(0 , profilePlan === 'Free' ? 2 : 300)
          .map(project =>
            <SplideSlide key={project.id}>
              <Flex align='center' gap={6} mb={5} className='carousel-project'>
                <Avatar
                  variant='filled'
                  radius='md'
                  size='64px'
                  color='violet'
                  name={'🎵'}
                  src={project.picture ? project.picture : undefined}
                  component='a'
                  href={`/project/${project.username}`}
                />
                <Flex
                  direction='column'
                  justify='flex-start'
                  align='flex-start'
                  wrap='wrap'
                >
                  <Box w={107}>
                    <Text size='11px' fw='460' mb='2' truncate='end'>
                      {project.left_in && 'ex '} {project.role1}{project.role2 && ', '+project.role2} em
                    </Text>
                  </Box>
                  <Box w={107}>
                    <Text
                      size='0.86rem'
                      fw='590'
                      mb='3'
                      truncate='end'
                      title={project.name}
                      className='lhNormal'
                    >
                      {project.name} {!!project.featured && <IconStarFilled style={{ width: '9px', height: '9px' }} color='gray' />}
                    </Text>
                  </Box>
                  <Text size='10.5px' fw='420' truncate='end' c='dimmed'>
                    {project.workTitle}
                  </Text>
                  <Text size='11px' fw='380' c='dimmed'>{project.type}</Text>
                  {/* <Text size='12px'>{project.workTitle}</Text> */}
                  {project.endYear && 
                    <Text size='9px' mt={5} fw={300}>
                      encerrado em {project.endYear}
                    </Text>
                  }
                </Flex>
              </Flex>
            </SplideSlide>
          )
        }
        {/* {(profile.id === userInfo.id && !profile.requesting && profilePlan === 'Free') && 
          <SplideSlide>
            <Flex align='flex-start' gap={7} mb={5} className='carousel-project'>
              <Avatar
                variant='gradient'
                gradient={{ from: 'violet', to: 'blue' }}
                radius='md'
                size='64px'
                color='white'
                name='❯'
                src={undefined}
              />
              <Flex 
                direction='column'
                justify='flex-start'
                align='flex-start'
                wrap='wrap'
              >
                <Text fz='10px' fw='390' truncate='end' c='dimmed'>
                  Assine o Mublin PRO
                </Text>
                <Box w={110}>
                  <Text size='0.77rem' fw='430' mb={3} className='lhNormal'>
                    Gerencie quantos projetos quiser!
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </SplideSlide>
        } */}
      </Splide>
    </>
  );
};

export default Projects;