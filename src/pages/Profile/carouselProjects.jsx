import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Box, Text, Avatar, em  } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { IconStarFilled } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import classes from './carousel.module.scss'

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
      <Carousel 
        slideSize={{ base: '100%', sm: '50%' }}
        slideGap={{ base: 'xl', sm: 'xl' }}
        align='start'
        slidesToScroll={isMobile ? 1 : 3}
        pt={8}
        height={88}
        controlsOffset='6px'
        controlSize={24}
        withControls={true}
        dragFree
        classNames={classes}
      >
        {projects.splice(0 , profilePlan === 'Free' ? 3 : 300).map((project, key) =>
          <Flex align='flex-start' gap={7} mb={10} key={key} className='carousel-project'>
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
              <Box w={114}>
                <Text c='dimmed' size='11px' fw={400} mb={3} truncate='end'>
                  {project.workTitle}
                </Text>
                <Text size='11px' fw={400} mb={3} truncate='end'>
                  {project.left_in && 'ex '} {project.role1}{project.role2 && ', '+project.role2} em
                </Text>
                <Text size='0.91rem' fw={490} mb={3} truncate='end' title={project.name}>
                  {project.name} {!!project.featured && <IconStarFilled style={{ width: '11px', height: '11px' }} color='gold' />}
                </Text>
                <Text size='12px' fw={400}>{project.type}</Text>
                {/* <Text size='12px'>{project.workTitle}</Text> */}
                {project.endYear && 
                  <Text size='10px' c='dimmed' mt={3}>
                    (encerrado em {project.endYear})
                  </Text>
                }
              </Box>
            </Flex>
          </Flex>
        )}
      </Carousel>
    </>
  );
};

export default CarouselProjects;