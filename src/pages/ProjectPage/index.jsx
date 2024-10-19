import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { projectInfos } from '../../store/actions/project';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Text, Image, Skeleton } from '@mantine/core';
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
        <Box mb={24}>
          {project.requesting && 
            <>
              <Skeleton height={50} circle mb="xl" />
              <Skeleton height={18} radius="xl" />
              <Skeleton height={18} mt={6} radius="xl" />
              <Skeleton height={18} mt={6} width="70%" radius="xl" />
            </>
            
          }
          {!project.requesting && 
            <>
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
                  h={130}
                  w="auto"
                  fit="contain"
                  src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture}
                />
                <Box>
                  <Text size='sm' c='dimmed'>{project.username}</Text>
                  <Title order={3}>{project.name}</Title>
                  <Text>{project.bio}</Text>
                </Box>
              </Flex>
            </>
          }
        </Box>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProjectPage;