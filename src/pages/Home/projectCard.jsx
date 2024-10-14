import React from 'react';
import { useSelector } from 'react-redux';
import { Group, Text, Card, Image, Badge, Menu, Avatar, Indicator, ActionIcon, Flex } from '@mantine/core';
import { IconDots, IconEye, IconFileZip, IconTrash , IconMapPin, IconFolder, IconIdBadge2, IconSettings } from '@tabler/icons-react';

function ProjectCard (props) {

  const project = props?.project;
  const user = useSelector(state => state.user);
  const cdnBaseURL = 'https://ik.imagekit.io/mublin/'
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-250,w-410,fo-top,c-maintain_ratio/';
  const currentYear = new Date().getFullYear();
  const isActiveOnProject = !!(project.active && !project.yearLeftTheProject && !project.yearEnd);

  const indicatorColor = () => {
    if (isActiveOnProject) {
      return 'lime';
    }
    if (project.yearLeftTheProject && !project.yearEnd) {
      return 'red';
    }
    if (!project.active || project.yearEnd) {
      return 'red';
    }
  }

  return (
    <Indicator 
      processing={isActiveOnProject}
      color={indicatorColor(project)}
      position="top-start" 
      disabled={!isActiveOnProject}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <div>
              <Text fw={500} lineClamp={1}>{project?.name}</Text>
              <Text size="sm" c="dimmed" lineClamp={1}>
                {project?.ptname} {project.genre1 ? ' · '+project.genre1 : null }
              </Text>
              {/* <Text size="xs" c="dimmed">
                {project.cityName ? <>
                  <IconMapPin style={{ width: '12px', height: '12px' }} /> {project.cityName}, {project.regionUf}
                  </> : null
                }
              </Text> */}
            </div>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots style={{ width: '16px', height: '16px' }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconFileZip style={{ width: '14px', height: '14px' }} />}>
                  Painel do Projeto
                </Menu.Item>
                <Menu.Item leftSection={<IconEye style={{ width: '14px', height: '14px' }} />}>
                  Perfil do Projeto
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash style={{ width: '14px', height: '14px' }} />}
                  color="red"
                >
                  Gerenciar participação
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        <Card.Section>
          <Image
            src={cdnProjectPath+project?.picture}
            height={160}
            alt="Norway"
            fit="contain"
          />
        </Card.Section>
        {/* <Group justify="flex-start" mt="md" mb="xs">
          {isActiveOnProject && 
            <Badge color="green" size="sm" variant="light"> Ativo atualmente neste projeto</Badge>
          }
        </Group> */}
        {/* <Text size="xs" c="dimmed">
          {project.cityName ? <>
            <IconMapPin style={{ width: '12px', height: '12px' }} /> {project.cityName}, {project.regionUf}
            </> : null
          }
        </Text> */}
        <Card.Section withBorder inheritPadding py="xs">
          <Flex
            justify="flex-start"
            align="center"
            direction="row"
            wrap="nowrap"
            columnGap="md"
          >
            <Avatar variant="filled" radius="sm" size="sm" src={cdnBaseURL+'tr:h-36,w-36,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture} />
            <Flex
              direction="column"
              wrap="wrap"
              rowGap={3}
            >
              <Text size="xs" display={'flex'} lineClamp={1}>
                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
              </Text>
              {project.yearEnd && 
                <Badge size='xs' variant='outline' color={indicatorColor()}>
                  Projeto encerrado em {project.yearEnd}
                </Badge>
              }
              {(project.id && project.yearLeftTheProject) && 
                <Badge size='xs' variant='outline' color="yellow">
                  deixei o projeto em {project.yearLeftTheProject}
                </Badge>
              }
              {(project.id && !project.yearLeftTheProject && !project.yearEnd) && 
                <Badge size='xs' variant='outline' color={indicatorColor()}>
                  {(project.id && !project.yearLeftTheProject && !project.yearEnd) ? 'desde ' + project.joined_in : null}
                </Badge>
              }
              <Text size="xs" display={'flex'} lineClamp={1}>
                <IconIdBadge2 style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> {project.workTitle}
              </Text>
              <Text size="xs" display={'flex'} lineClamp={1}>
                <IconSettings style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> Administrador
              </Text>
            </Flex>
          </Flex>
          {/* {isActiveOnProject && 
            <Badge leftSection={<IconIdBadge2 style={{ width: '13px', height: '13px' }} stroke={1.2} />} size="md" variant="light">{project.workTitle}</Badge>
          } */}
        </Card.Section>
        <Card.Section withBorder inheritPadding py="xs">
          <Flex align="center" justify="flex-start" direction="row" c="dimmed">
            <IconFolder 
              style={{ width: '15px', height: '15px', marginRight: '3px' }}
            />
            <Text size="xs">
              {project.portfolio ? 'Portfolio' : 'Projetos Principais'}
            </Text>
          </Flex>
        </Card.Section>
        {/* <Card.Section withBorder inheritPadding py="xs">
          {!!project.id && 
            <div>
              <Badge size="xs" variant="light">{project.workTitle}</Badge>
              {!!(project.touring && !project.yearLeftTheProject && !project.yearEnd) && <Badge size="xs" variant="light">Em turnê com este projeto</Badge>} {!!project.admin && <Badge size="xs" variant="light">Administrador</Badge>} {!!(!project.yearLeftTheProject && !project.yearEnd && (currentYear - project.joined_in) >= 10) && <Badge size="xs" variant="light">há + de 10 anos ativo no projeto!</Badge>} 
            </div>
          }
        </Card.Section> */}
      </Card>
    </Indicator>
  );
};

export default ProjectCard;