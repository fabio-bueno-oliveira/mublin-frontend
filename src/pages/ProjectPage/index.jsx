import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { projectInfos } from '../../store/actions/project';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Text, Image, Skeleton, BackgroundImage, Paper } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function ProjectPage () {

  const params = useParams();
  const username = params?.username;
  const project = useSelector(state => state.project);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username));
    // dispatch(projectInfos.getProjectMembers(props.match.params.username));
  }, []);

  document.title = project.name+' | Mublin';

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
                <Skeleton height={28} width={180} mb={10} />
                <Skeleton height={18} width={180} />
              </Box>
            </Flex>
          </Paper>
        }
        {!project.requesting && 
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
                <Text size='xs' c='dimmed'>{`de ${project.city}, ${project.region}`} </Text>
              </Box>
            </Flex>
          </Paper>
        }
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProjectPage;