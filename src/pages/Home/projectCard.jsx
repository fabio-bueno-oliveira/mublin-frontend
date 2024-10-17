import React from 'react';
import { useSelector } from 'react-redux';
import { Group, Title, Text, Card, Image, Badge, Menu, Avatar, Indicator, ActionIcon, Flex, Tooltip, rem } from '@mantine/core';
import { IconDots, IconEye, IconFileZip, IconUserCog , IconUsersGroup, IconUser, IconBulb, IconFolder, IconIdBadge2, IconSettings, IconUserOff } from '@tabler/icons-react';

function ProjectCard (props) {

  const project = props?.project;
  const activeMembers = props?.activeMembers;

  const user = useSelector(state => state.user);
  const cdnBaseURL = 'https://ik.imagekit.io/mublin/';
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-250,w-410,fo-top,c-maintain_ratio/';
  // const currentYear = new Date().getFullYear();
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
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title fw={500} lineClamp={1} size="h4">{project?.name}</Title>
            <Group gap={4}>
              {project?.ptname === "Projeto solo" &&
                <IconUser style={{ width: rem(13), height: rem(13) }} color='grey' stroke={1.5} /> 
              }
              {project?.ptname === "Banda" &&
                <IconUsersGroup style={{ width: rem(13), height: rem(13) }} color='grey' stroke={1.5} />
              } 
              {project?.ptname === "Ideia de projeto" &&
                <IconBulb style={{ width: rem(13), height: rem(13) }} color='grey' stroke={1.5} />
              }
              <Text size="xs" c="dimmed" lineClamp={1}>
                {project?.ptname} {project.genre1 ? ' · '+project.genre1 : null }
              </Text>
            </Group>
            <Text size="xs" c="dimmed" lineClamp={1} mt={5}>
              <Badge variant='dot' color={project?.activityStatusColor} size='xs'>
                {project?.activityStatus} {(project.activityStatusId === 2 && project.yearEnd) && `em ${project.yearEnd}`}
              </Badge>
            </Text>
          </div>
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
              <Menu.Item leftSection={<IconFileZip style={{ width: '14px', height: '14px' }} />}>
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
      </Card.Section>
      <Card.Section>
        <Image
          src={cdnProjectPath+project?.picture}
          height={160}
          alt="Norway"
        />
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Text size="sm">
          Minha participação
        </Text>
        {isActiveOnProject && 
          <Badge size='xs' variant='light' color={indicatorColor()}>
            {`Ativo desde ${project.joined_in}`}
          </Badge>
        }
        {project.yearLeftTheProject && 
          <Badge size='xs' variant='light' color="red">
            deixei o projeto em {project.yearLeftTheProject}
          </Badge>
        }
        {(project.activityStatusId === 2 && project.yearEnd && !project.yearLeftTheProject) && 
          <Badge size='xs' variant='light' color="red">
            estive até o encerramento em {project.yearEnd}
          </Badge>
        }
        <Flex
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
          columnGap="md"
          mt={6}
        >
          <Indicator 
            processing={isActiveOnProject}
            color={indicatorColor(project)}
            size={8}
            position="top-end"
            // display={'inline-table'}
            // style={{ display: 'inline-table' }}
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
          </Indicator>
          <Flex
            direction="column"
            wrap="wrap"
            rowGap={3}
          >
            <Text size="xs" lineClamp={1}>
              {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
            </Text>
            <Text size="xs" display={'flex'} lineClamp={1}>
              <IconIdBadge2 style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> {project.workTitle}
            </Text>
            <Text size="xs" display={'flex'} lineClamp={1}>
              <IconSettings style={{ width: '15px', height: '15px', marginRight: '3px' }} stroke={1.2} /> Administrador
            </Text>
          </Flex>
        </Flex>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Text size="xs" c="dimmed" mb={5}>
          {activeMembers?.length} Integrantes/equipe ativos
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
      <Card.Section withBorder inheritPadding py="xs">
        <Flex align="center" justify="flex-start" direction="row" c="dimmed">
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
  );
};

export default ProjectCard;