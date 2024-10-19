import React from 'react';
import { useSelector } from 'react-redux';
import { Group, Title, Text, Card, Image, Badge, Menu, Avatar, Indicator, ActionIcon, Flex, Tooltip, Skeleton, rem } from '@mantine/core';
import { IconDots, IconEye, IconUserCog , IconUsersGroup, IconUser, IconBulb, IconFolder, IconIdBadge2, IconSettings, IconUserOff, IconToggleRightFilled, IconToggleLeftFilled } from '@tabler/icons-react';

function ProjectCard (props) {

  const loading = props?.loading;
  const project = props?.project;
  const activeMembers = props?.activeMembers;

  const user = useSelector(state => state.user);
  const cdnBaseURL = 'https://ik.imagekit.io/mublin/';
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-250,w-410,fo-top,c-maintain_ratio/';
  const currentYear = new Date().getFullYear();
  const isActiveOnProject = !!(project.active && !project.yearLeftTheProject && !project.yearEnd);

  const iconProjectActivityStyles = { width: '16px', height: '16px' };

  return (
    loading ? (
      <>
        <Skeleton height={50} circle mb="xl" mt="lg" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    ) : ( 
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" px="xs">
          <Group justify="space-between" align="flex-start" wrap='nowrap' style={{ justify: 'space-between' }}>
            <Group justify="flex-start" align="center" wrap='nowrap' gap={8}>
              <Avatar variant="filled" radius="md" size="md" src={cdnProjectPath+project?.picture} />
              <div>
                <Title fw={500} lineClamp={1} size="1rem">{project?.name}</Title>
                <Group gap={4}>
                  {project?.ptname === "Projeto solo" &&
                    <IconUser style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
                  }
                  {project?.ptname === "Banda" &&
                    <IconUsersGroup style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
                  } 
                  {project?.ptname === "Ideia de projeto" &&
                    <IconBulb style={{ width: '12px', height: '12px' }} stroke={1.5} /> 
                  }
                  <Text size="11px" lineClamp={1} pt={1}>
                    {project?.ptname} {project.genre1 ? ' · '+project.genre1 : null }
                  </Text>
                </Group>
              </div>
            </Group>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots style={{ width: '16px', height: '16px' }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEye style={{ width: '14px', height: '14px' }} />}>
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
          </Group>
          <Group justify="flex-start" align="center" mt={5} wrap='nowrap' gap={3}>
            {project?.activityStatusColor === 'green' && <IconToggleRightFilled style={iconProjectActivityStyles} color='green' />}
            {project?.activityStatusColor === 'gray' && <IconToggleLeftFilled style={iconProjectActivityStyles} color='gray' />}
            <Text size={'10px'} lineClamp={1} c={project?.activityStatusColor}>
              {project?.activityStatus} {(project.activityStatusId === 2 && project.yearEnd) && `em ${project.yearEnd}`}
            </Text>
          </Group>
        </Card.Section>
        
        <Card.Section withBorder inheritPadding py="xs" px="xs">
          <Flex
            justify="flex-start"
            align="center"
            direction="row"
            wrap="nowrap"
            columnGap="xs"
            mt={6}
          >
            <Avatar 
              variant="filled" 
              radius="sm" 
              size="md" 
              src={
                (user.id && user.picture) ? 
                  cdnBaseURL+'tr:h-66,w-66,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture
                : null
                } 
            />
            <Flex
              direction="column"
              wrap="wrap"
              rowGap={3}
            >
              <Text size="xs" fw={500} lineClamp={1}> 
                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
              </Text>
              {isActiveOnProject && 
                <Text size='10px' c="green">
                  {`${project.joined_in} - Atualmente (${currentYear - project.joined_in} anos)`}
                </Text>
              }
              {project.yearLeftTheProject && 
                <Text size='10px' c="red">
                  deixei o projeto em {project.yearLeftTheProject}
                </Text>
              }
              {(project.activityStatusId === 2 && project.yearEnd && !project.yearLeftTheProject) && 
                <Text size='10px' c="red">
                  {project.joined_in} até o encerramento em {project.yearEnd}
                </Text>
              }
              <Text size="xs" display={'flex'} lineClamp={1} mt={6}>
                <IconIdBadge2 style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> {project.workTitle}
              </Text>
              <Text size="xs" display={'flex'} lineClamp={1}>
                <IconSettings style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> Administrador
              </Text>
            </Flex>
          </Flex>
          <Text size="xs" c="dimmed" mb={5} mt={14}>
            Integrantes ativos ({activeMembers?.length})
          </Text>
          <Group gap={5}>
            {activeMembers?.map((member) => (
              <Tooltip 
                label={`${member.userName} ${member.userLastname} - ${member.role1}`} 
                key={member.userId} 
                withArrow
              >
                <Avatar 
                  variant="filled" 
                  radius="sm" 
                  size="sm" 
                  src={
                    (member.userId && member.userPicture) ? 
                      cdnBaseURL+'tr:h-26,w-26,r-max,c-maintain_ratio/users/avatars/'+member.userId+'/'+member.userPicture
                    : null
                  } 
                />
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
    )
  );
};

export default ProjectCard;