import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Box, Text, Badge, Avatar, em  } from '@mantine/core'
import { IconStarFilled } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function CarouselProjects (props) {

  let navigate = useNavigate()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const profile = props.profile
  const profilePlan = props.profilePlan

  const projects = profile.projects.filter((project) => { return project.show_on_profile === 1 && project.confirmed === 1 })

  const goToProject = (username) => {
    navigate('/project/'+username)
  }

  return (
    <>
      <Splide 
        options={{
          drag: 'free',
          snap: false,
          perPage: isMobile ? 1 : 1,
          autoWidth: true,
          arrows: false,
          gap: '22px',
          dots: false,
          pagination: false,
        }}
      >
        {projects.splice(0 , profilePlan === 'Free' ? 2 : 300).map((project, key) =>
          <SplideSlide key={key}>
            <Flex align='flex-start' gap={7} mb={5} className='carousel-project'>
              <Avatar 
                variant='filled' 
                radius='md' 
                size='82px' 
                color='violet'
                name={'🎵'}
                src={project.picture ? project.picture : undefined} 
                onClick={() => goToProject(project.username)}
              />
              <Flex 
                direction={'column'}
                justify='flex-start'
                align='flex-start'
                wrap='wrap'
              >
                <Text fz='10px' fw='340' truncate='end' c='dimmed'>{project.workTitle}</Text>
                <Box w={106}>
                  <Text size='11px' fw={320} mb={3} truncate='end'>
                    {project.left_in && 'ex '} {project.role1}{project.role2 && ', '+project.role2} em
                  </Text>
                </Box>
                <Box w={106}>
                  <Text size='0.91rem' fw='420' mb={3} truncate='end' title={project.name} className='lhNormal'>
                    {project.name} {!!project.featured && <IconStarFilled style={{ width: '11px', height: '11px' }} color='gold' />}
                  </Text>
                </Box>
                <Text size='12px' fw='210' c='dimmed'>{project.type}</Text>
                {/* <Text size='12px'>{project.workTitle}</Text> */}
                {project.endYear && 
                  <Text size='10px' c='dimmed' mt={3}>
                    encerrado em {project.endYear}
                  </Text>
                }
              </Flex>
            </Flex>
          </SplideSlide>
        )}
      </Splide>
    </>
  );
};

export default CarouselProjects;