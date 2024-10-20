import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { projectInfos } from '../../store/actions/project';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Card, Text, Image, Skeleton, Group, Center, Avatar, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function ProjectPage () {

  const params = useParams();
  const username = params?.username;
  const project = useSelector(state => state.project);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username));
    dispatch(projectInfos.getProjectMembers(username));
  }, []);

  document.title = project.name+' | Mublin';

  const members = project.members.filter((member) => { return member.confirmed === 1 });

  return (
    <>
      <Header />
      <Container size={'lg'}>
        {project.requesting && 
          <Paper shadow="md" radius="md" withBorder p="md" mb={25}
            style={{ backgroundColor: 'transparent' }}
          >
            <Flex
              justify="flex-start"
              align="center"
              direction="row"
              wrap="nowrap"
              columnGap="xs"
              mt={6}
            >
              <Skeleton radius="md" width={80} height={80} />
              <Box>
                <Skeleton height={21} width={180} mb={8} />
                <Skeleton height={17} width={180} mb={8} />
                <Skeleton height={12} width={180} />
              </Box>
            </Flex>
          </Paper>
        }
        {!project.requesting && 
          <>
            <Paper shadow="md" radius="md" withBorder p="md" mb={25}
              style={{ backgroundColor: 'transparent' }}
            >
              <Flex
                justify="flex-start"
                align="center"
                direction="row"
                wrap="nowrap"
                columnGap="xs"
                mt={6}
              >
                <Image
                  radius="md"
                  h={80}
                  w="auto"
                  fit="contain"
                  src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture}
                />
                <Box>
                  <Title order={3} mb={1}>{project.name}</Title>
                  <Text size='sm' mb={3}>
                    {project.typeName} {project.genre1 && ' · ' + project.genre1}{project.genre2 && ', ' + project.genre2}{project.genre3 && ', ' + project.genre3}
                  </Text>
                  {project.country && 
                    <Text size='xs' c='dimmed'>
                      {`de ${project.city}, ${project.region} · ${project.country}`}
                    </Text>
                  }
                </Box>
              </Flex>
            </Paper>
            {project.bio && 
              <>
                <Title size="h4">Sobre {project.name}</Title>
                <Text size="sm">{project.bio}</Text>
              </>
            }
          </>
        }
        <Title size="h4" mt={24} mb={14}>Integrantes</Title>
        <Carousel 
          align="start" 
          slideSize="20%"
          slideGap="md" 
          // slidesToScroll={5}
          dragFree 
          withControls={true}
        >
          {members.map((member, key) =>
            <Carousel.Slide key={key}>
              <Card>
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                >
                  <Avatar size="lg" name={member.name} src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/'+member.id+'/'+member.picture} />
                  <Text ta="center" size={'sm'} mt={8}>{member.name+' '+member.lastname}</Text>
                  <Text ta="center" size={'xs'}>{member.role1}</Text>
                  <Text ta="center" c="dimmed" size={'10px'} mt={4}>Desde {member.joinedIn}</Text>
                </Flex>
              </Card>
            </Carousel.Slide>
          )}
        </Carousel>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProjectPage;