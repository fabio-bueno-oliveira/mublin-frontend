import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { projectInfos } from '../../store/actions/project';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Card, Text, Image, Skeleton, Avatar, Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import useEmblaCarousel from 'embla-carousel-react';
import './styles.scss';

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
  const largeScreen = useMediaQuery('(min-width: 60em)');

  const [emblaRef] = useEmblaCarousel(
    {
      active: (
        (largeScreen && members.length < 10) || (!largeScreen && members.length < 4)
      ) ? false : true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )

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
        <Title size="h4" mt={24} mb={14}>Integrantes e Equipe</Title>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {members.map((member, key) =>
              <div className="embla__slide">
                <Card withBorder style={{ backgroundColor: 'transparent' }}>
                  <Flex
                    justify="center"
                    align="center"
                    direction="column"
                  >
                    <Link to={{ pathname: `/${member.username}` }}>
                      <Avatar size="lg" name={member.name} src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/'+member.id+'/'+member.picture} />
                    </Link>
                    <Text ta="center" size={'12px'} fw={500} mt={8} mb={3} lineClamp={1}>
                      {member.name+' '+member.lastname}
                    </Text>
                    <Text ta="center" size={'11px'} lineClamp={1}>
                      {member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}
                    </Text>
                    <Text ta="center" c="dimmed" size={'10px'} mt={4}>Desde {member.joinedIn}</Text>
                  </Flex>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProjectPage;