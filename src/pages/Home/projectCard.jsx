import React from 'react';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Group, Title, Text, Card, Badge, Menu, Avatar, ActionIcon, Flex, Tooltip, Divider, Anchor, Indicator } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots, IconDotsVertical, IconEye, IconUserCog , IconUsersGroup, IconUser, IconBulb, IconIdBadge2, IconCircleDashedCheck, IconMusic, IconSettings, IconUserOff, IconRoad, IconCircleFilled } from '@tabler/icons-react';

function ProjectCard (props) {

  const project = props?.project;
  const loading = props.loading;
  const activeMembers = props?.activeMembers;

  const largeScreen = useMediaQuery('(min-width: 60em)');
  // const user = useSelector(state => state.user);

  const cdnBaseURL = 'https://ik.imagekit.io/mublin/';
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-250,w-410,fo-top,c-maintain_ratio/';
  // const cdnProjectPathBlur = cdnBaseURL+'projects/tr:bl-6,h-80,w-410,fo-middle,c-maintain_ratio/';
  
  const currentYear = new Date().getFullYear();
  const isActiveOnProject = !!(project.active && !project.yearLeftTheProject && !project.yearEnd);

  const iconCircleStyles = { width: '8px', height: '8px', marginLeft: '3px', marginRight: '3px' };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* <Card.Section>
        <Image
          src={cdnProjectPathBlur+project?.picture}
          height={15}
          alt="Norway"
        />
      </Card.Section> */}
      <Card.Section withBorder inheritPadding pt="6px" pb="10px" px="xs">
        <Flex
          justify="space-between"
          align="flex-start"
          direction="row"
          wrap="nowrap"
          columnGap="xs"
          mt={6}
        >
          {/* <Avatar 
            variant="filled" 
            radius="xl" 
            size="md" 
            src={
              (user.id && user.picture) ? 
                cdnBaseURL+'tr:h-66,w-66,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture
              : null
              } 
          /> */}
          <Flex
            direction="column"
            wrap="wrap"
            rowGap={3}
          >
            <Text size="13px" fw={500} lineClamp={1}> 
              {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
            </Text>
            <Flex align="end" justify="flex-start" direction="row" mb={1}>
              {project.workTitle === "Membro oficial" && 
                <IconCircleDashedCheck style={{ width: '14px', height: '14px', marginRight: '3px' }} stroke={1.2} />
              }
              {project.workTitle === "Contratado" && 
                <IconIdBadge2 style={{ width: '14px', height: '14px', marginRight: '3px' }} stroke={1.2} />
              }
              <Text size={'11.5px'} truncate="end">
                {project.workTitle}
              </Text>
              {!!project.admin && 
                <>
                  <IconSettings style={{ width: '14px', height: '14px', marginLeft: '5px' }} stroke={1.2} />
                  <Text size={'11.5px'} truncate="end">
                    Admin
                  </Text>
                </>
              }
            </Flex>
            {isActiveOnProject && 
              <Flex align='center' mt={3}>
                <IconCircleFilled style={iconCircleStyles} color='green' /><Text size='10px'>{`${project.joined_in} - atualmente (${currentYear - project.joined_in} anos)`}</Text>
              </Flex>
            }
            {project.yearLeftTheProject && 
              <Flex align='center' mt={3}>
                <IconCircleFilled style={iconCircleStyles} color='red' /><Text size='10px'>deixei o projeto em {project.yearLeftTheProject}</Text>
              </Flex>
            }
            {(project.activityStatusId === 2 && project.yearEnd && !project.yearLeftTheProject) && 
              <Flex align='center' mt={3}>
                <IconCircleFilled style={iconCircleStyles} color='red' /><Text size='10px'>{project.joined_in} até o encerramento em {project.yearEnd}</Text>
              </Flex>
            }
          </Flex>
          <Menu withArrow withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical style={{ width: '16px', height: '16px' }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconEye style={{ width: '14px', height: '14px' }} />}
                href={'/project/'+project.username}
                component="a"
              >
                Página do Projeto
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings style={{ width: '14px', height: '14px' }} />}>
                Painel do Projeto
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconUserCog style={{ width: '14px', height: '14px' }} />}
              >
                Gerenciar participação
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs" px="xs">
        <Group justify="flex-start" align="flex-start" wrap='nowrap' gap={8}>
          <Link to={{ pathname: `/project/${project?.username}` }}>
            <Indicator 
              size="xs" 
              position="bottom-center" 
              inline 
              color="violet"
              label={
                <div style={{fontSize: '9px'}}>Em turnê</div>
              }
              disabled={!project.projectCurrentlyOnTour}
            >
            <Avatar 
              variant="filled" 
              radius="md" 
              size="70px" 
              color="violet"
              name={"🎵"}
              src={(!loading && project.picture) ? cdnProjectPath+project?.picture : undefined} 
            />
            </Indicator>
          </Link>
          <div>
            <Anchor
              href={`/project/${project?.username}`}
            >
              <Title 
                fw={largeScreen ? 600 : 600}
                lineClamp={1} 
                size={largeScreen ? '0.9rem' : '1rem'}
                mb={!project?.regionName ? 0 : 0}
              >
                {project?.name}
              </Title>
            </Anchor>
            {project?.regionName && 
              <Text size="10px" truncate="end" mb={4} c="dimmed">
                {project.cityName && `de ${project.cityName}, `} {`${project.regionUf},`} {`${project.countryName}`}  
              </Text>
            }
            <Group gap={2} mb={0} truncate="start" fz={"10px"}>
              {project?.ptname === "Projeto solo" &&
                <IconUser style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
              }
              {project?.ptname === "Banda" &&
                <IconUsersGroup style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
              } 
              {project?.ptname === "Ideia" &&
                <IconBulb style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
              }
              <Text size="11px" pt={1} lineClamp={1}>
                {project?.ptname} {project.genre1 && ' · '}
              </Text>
              {project.genre1 && 
                <>
                  <IconMusic style={{ width: '12px', height: '12px' }} />
                  <Text size="11px" pt={1} lineClamp={1} truncate="end">
                    {project.genre1 ? project.genre1 : null }
                  </Text>
                </>
              }
            </Group>
            <Badge size="xs" variant="light" color={project?.activityStatusColor}>
              {project?.activityStatus} {(project.activityStatusId === 2 && project.yearEnd) && `em ${project.yearEnd}`}
            </Badge>
          </div>
        </Group>
        <Divider 
          my="xs" 
          label={`Integrantes ativos (${activeMembers?.length})`} 
          labelPosition="left" 
        />
        <Group gap={5}>
          {activeMembers?.map((member) => (
            <Tooltip 
              label={`${member.userName} ${member.userLastname} - ${member.role1}`} 
              key={member.userId} 
              withArrow
            >
              <Link to={{ pathname: `/${member.userUsername}` }}>
                <Avatar 
                  variant="filled" 
                  radius="xl" 
                  size="sm"
                  name={`${member.userName} ${member.userLastname}`}
                  color={"violet"}
                  src={
                    (member.userId && member.userPicture) ? 
                      cdnBaseURL+'tr:h-26,w-26,r-max,c-maintain_ratio/users/avatars/'+member.userId+'/'+member.userPicture
                    : null
                  } 
                />
              </Link>
            </Tooltip>
          ))}
          {!activeMembers?.length && 
            <Avatar 
              variant="filled" 
              radius="xl" 
              size="sm"
            >
              <IconUserOff size="1rem" />
            </Avatar>
          }
        </Group>
      </Card.Section>
      {/* <Card.Section withBorder inheritPadding py="xs">
        <Flex align="center" justify="flex-start" direction="row">
          <Text style={{ fontSize: '11px' }}>
            Categoria: 
          </Text>
          <IconFolder 
            style={{ width: '14px', height: '14px', marginLeft: '3px', marginRight: '3px' }}
          />
          <Text style={{ fontSize: '11px' }}>
            {project.portfolio ? 'Portfolio' : 'Principais'}
          </Text>
        </Flex>
      </Card.Section> */}
      {/* <Card.Section withBorder inheritPadding py="xs">
        {!!project.id && 
          <div>
            <Badge size="xs" variant="light">{project.workTitle}</Badge>
            {!!(project.touring && !project.yearLeftTheProject && !project.yearEnd) && <Badge size="xs" variant="light">Em turnê com este projeto</Badge>} {!!project.admin && <Badge size="xs" variant="light">Administrador</Badge>} {!!(!project.yearLeftTheProject && !project.yearEnd && (currentYear - project.joined_in) >= 10) && <Badge size="xs" variant="light">há + de 10 anos ativo no projeto!</Badge>} 
          </div>
        }
      </Card.Section> */}
    </Card>
  );
};

export default ProjectCard;