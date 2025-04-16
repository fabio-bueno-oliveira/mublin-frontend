import React from 'react'
import { Flex, Box, Text, Avatar, Skeleton } from '@mantine/core'
import { IconStarFilled } from '@tabler/icons-react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function Projects (props) {

  const profile = props.profile
  const profilePlan = props.profilePlan
  // const showPastProjects = props.showPastProjects
  const loggedUserId = props.loggedUserId

  const requesting = props.requesting

  const projects = profile.projects.result.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 })

  const totalProjects = profile.projects.total

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
          // .filter(
          //   (project) => { return showPastProjects ? project.left_in || !project.left_in || project.endYear || !project.endYear : !project.left_in && !project.endYear }
          // )
          .splice(0 , profilePlan === 'Free' ? 2 : 300)
          .map(project =>
            <SplideSlide key={project.id}>
              <Flex align='center' gap={6} mb={5} className='carousel-project'>
                <Avatar
                  variant='filled'
                  radius='md'
                  size='80px'
                  color='violet'
                  name={'🎵'}
                  src={project.picture ? `https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/${project.pictureFilename}` : 'https://placehold.co/80x80?text=Carregando...'}
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
                      size='1rem'
                      fw='590'
                      truncate='end'
                      title={project.name}
                      className='lhNormal'
                    >
                      {project.name} {!!project.featured && <IconStarFilled style={{ width: '9px', height: '9px' }} color='gray' />}
                    </Text>
                  </Box>
                  <Text size='12px' fw='420' truncate='end'>
                    {project.workTitle}
                  </Text>
                  <Text mt={4} size='11px' fw='380' c='dimmed'>
                    {project.type}
                  </Text>
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
        {(
          profile.id === loggedUserId && 
          !profile.requesting && 
          profilePlan === 'Free' && 
          totalProjects >= 2
        ) && 
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
                component='a'
                href='/settings/plan'
              />
              <Flex 
                direction='column'
                justify='flex-start'
                align='flex-start'
                wrap='wrap'
              >
                <Text fz='11px' fw='390' truncate='end'>
                  Você atingiu o limite de 2 projetos
                </Text>
                <Box w={150}>
                  <Text size='0.7rem' c='dimmed' mb={3} className='lhNormal'>
                    Assine o Mublin PRO e gerencie quantos projetos quiser!
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </SplideSlide>
        }
      </Splide>
    </>
  );
};

export default Projects;