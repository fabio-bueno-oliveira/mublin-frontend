import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Group, Box, Title, Text, Card, Badge, Image, Menu, Avatar, ActionIcon, Flex, Tooltip, Divider, Anchor, Button, Indicator } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDotsVertical, IconEye, IconUserCog , IconUsersGroup, IconUser, IconBulb, IconMusic, IconSettings, IconUserOff, IconCircleFilled, IconCalendarEvent, IconThumbDown, IconThumbUp, IconNotes, IconMicrophone2 } from '@tabler/icons-react';

function ProjectCard (props) {

  const project = props?.project;
  const loading = props.loading;
  const activeMembers = props?.activeMembers;
  const keyIndex = props.key;

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);

  const cdnBaseURL = 'https://ik.imagekit.io/mublin/';
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-200,w-200,c-maintain_ratio/';
  // const cdnProjectPathBlur = cdnBaseURL+'projects/tr:bl-6,h-80,w-410,fo-middle,c-maintain_ratio/';
  
  const currentYear = new Date().getFullYear();
  const isActiveOnProject = !!(project.active && !project.yearLeftTheProject && !project.yearEnd);

  const yearText = (yearSum) => {
    return yearSum === 1 ? " ano" : " anos";
  }

  const years = (yearSmallest, yearBiggest) => {
    let subtraction = (yearBiggest - yearSmallest);
    return subtraction === 0 ? "(menos de 1 ano)" : "("+subtraction + yearText(subtraction)+")";
  }

  const [isEventLoading, setEventIsLoading] = useState({key: null, response: null});

  return (
    <Card 
      padding="lg"
      radius="md"
      withBorder
      className="mublinModule"
    >
      {/* <Card.Section>
        <Image
          src={cdnProjectPathBlur+project?.picture}
          height={15}
          alt="Norway"
        />
      </Card.Section> */}
      <Card.Section withBorder inheritPadding pt="6px" pb="10px" px="xs">
        
        {/* <Divider
          mt={11}
          mb={11} 
          label={
            <Badge size="xs" variant="light" color={project?.activityStatusColor}>
              {project?.activityStatus} {(project.activityStatusId === 2 && project.yearEnd) && `em ${project.yearEnd}`}
            </Badge>
          } 
        /> */}
        <Flex
          justify="space-between"
          columnGap="xs"
          mb={8}
        >
          <Group justify="flex-start" align="flex-start" wrap='nowrap' mt={8} gap={8}>
            <Link to={{ pathname: `/project/${project?.username}` }}>
              <Avatar 
                variant="filled" 
                radius="md" 
                size="54px" 
                color="violet"
                name={"🎵"}
                src={(!loading && project.picture) ? cdnProjectPath+project?.picture : undefined} 
              />
            </Link>
            <div>
              <Anchor
                href={`/project/${project?.username}`}
              >
                <Flex gap={5} align='center'>
                  <Title 
                    fw={largeScreen ? 500 : 600}
                    lineClamp={1} 
                    size={largeScreen ? '1.05rem' : '1.05rem'}
                    mb={!project?.regionName ? 0 : 0}
                  >
                    {project.name}
                  </Title>
                  {!!project.projectCurrentlyOnTour && <Badge size='xs' variant='light' color='violet'>Em turnê</Badge>}
                </Flex>
              </Anchor>
              {project?.regionName && 
                <Text size="11px" truncate="end" mt={1} mb={4}>
                  {project.cityName && `de ${project.cityName}, `} {`${project.regionUf},`} {`${project.countryName}`}  
                </Text>
              }
              <Group gap={2} truncate="start" fz="10px" c="dimmed">
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
            </div>
          </Group>
          <IconMusic 
            style={{opacity:'0.1',marginRight:'7px',marginTop:'7px'}} 
          />
          {/* <Menu withArrow withinPortal position="bottom-end" shadow="sm">
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
          </Menu> */}
        </Flex>
        <Flex align={"center"}>
          {/* <Avatar 
            variant="filled" 
            radius="xl" 
            size="sm" 
            mr={7}
            src={
              (user.id && user.picture) ? 
                cdnBaseURL+'tr:h-66,w-66,r-max,c-maintain_ratio/users/avatars/'+user.picture
              : null
              } 
          /> */}
          <Flex
            direction="column"
            wrap="wrap"
            rowGap={3}
          >
            <Group gap={3}>
              <Image 
                h={18}
                w={18} 
                src={'https://ik.imagekit.io/mublin/tr:h-18,w-18,r-max,c-maintain_ratio/users/avatars/'+user.picture}  
              />
              <Text size={largeScreen ? "13px" : "13px"} fw={400} lineClamp={1}> 
                {project.yearLeftTheProject && "ex "}{project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
              </Text>
            </Group>
            {isActiveOnProject && 
              <Flex align='center'>
                <Indicator inline processing color="green" size={6} ml={5} mr={7} />
                <Text size='10px'>
                  {`${project.joined_in} › Atualmente`} {years(project.joined_in, currentYear)}
                </Text>
              </Flex>
            }
            {project.yearLeftTheProject && 
              <Flex align='center'>
                <Indicator inline color="#ad413f" size={6} ml={5} mr={7} />
                <Text size='10px'>
                  deixei o projeto em {project.yearLeftTheProject} {years(project.yearFoundation, project.yearLeftTheProject)}
                </Text>
              </Flex>
            }
            {(project.activityStatusId === 2 && project.yearEnd && !project.yearLeftTheProject) && 
              <Flex align='center'>
                <Indicator inline color="gray" size={6} ml={5} mr={7} />
                <Text size='10px'>
                  {project.joined_in} até o encerramento em {project.yearEnd} {years(project.joined_in, project.yearEnd)}
                </Text>
              </Flex>
            }
          </Flex>
        </Flex>
        <Divider 
          mt={6}
          label={<Group gap={1}><IconNotes size={14} /> Vínculo</Group>} 
          labelPosition="left" 
        />
        <Text size="12px">
          {project.workTitle} {!!project.admin && " · Administrador"}
        </Text>
        {!project.yearEnd && 
          <>
            <Divider 
              mt={4}
              label={<Group gap={1}><IconMicrophone2 size={14} /> Próximo evento</Group>} 
              labelPosition="left" 
            />
            <Flex gap={2} align='center'>
              {project.nextEventDateOpening && 
                <IconCalendarEvent size={16} />
              }
              <div>
                <Text size='10px'>
                  {project.nextEventDateOpening ? project.nextEventDateOpening + ' às ' + project.nextEventHourOpening.substr(0,5) : null}
                </Text>
                <Text size='12px' fw={400}>
                  {project.nextEventDateOpening ? 
                    <>{project.nextEventTitle}</> 
                  : 
                    'Nenhum evento programado'
                  }
                </Text>
              </div>
            </Flex>
            {(project.nextEventDateOpening && project.nextEventInvitationId) && 
              <>
                <Group gap={4} my={6}>
                  <Image h={18} w={18} src={'https://ik.imagekit.io/mublin/tr:h-18,w-18,r-max,c-maintain_ratio/users/avatars/'+project.nextEventInvitationPictureWhoInvited} title={project.nextEventInvitationUsernameWhoInvited} />
                  {(user.id !== project.nextEventInvitationUserIdWhoInvited) ? 
                    <Text size='10px'>
                      {project.nextEventInvitationNameWhoInvited} te convidou em {project.nextEventInvitationDate.substr(0,11)}
                    </Text>
                  :
                    <Text size='10px'>
                      Você criou este evento em {project.nextEventInvitationDate.substr(0,11)}
                    </Text>
                  }
                </Group>
                <Button.Group>
                  <Button 
                    variant="default" 
                    fullWidth 
                    size="xs" 
                    leftSection={<IconThumbUp size={14} />}
                    color={project.nextEventInvitationResponse === 1 ? 'green' : null}
                    onClick={project.nextEventInvitationResponse === 1 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalAcceptEvent(key)}
                    loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false}
                  >
                    Aceitar
                  </Button>
                  <Button 
                    variant="default" 
                    fullWidth 
                    size="xs" 
                    color={project.nextEventInvitationResponse === 0 ? 'red' : null} 
                    onClick={project.nextEventInvitationResponse === 0 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalDeclineEvent(key)} 
                    loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false} 
                    leftSection={<IconThumbDown size={14} />}
                  >
                    Recusar
                  </Button>
                  <Button 
                    variant="default" 
                    fullWidth 
                    size="xs"
                  >
                    + detalhes
                  </Button>
                </Button.Group>
              </>
            }
          </>
        }
        <Divider 
          mt={9}
          mb={5}
          label={<Group gap={1}><IconUsersGroup size={14} /> Integrantes ativos ({activeMembers?.length})</Group>} 
          labelPosition="left" 
        />
        <Group gap={5}>
          {activeMembers?.length && 
            <Avatar.Group>
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
                      size="md"
                      name={`${member.userName} ${member.userLastname}`}
                      color={"violet"}
                      src={
                        (member.userId && member.userPicture) ? 
                          cdnBaseURL+'tr:h-114,w-114/users/avatars/'+member.userPicture
                        : null
                      } 
                    />
                  </Link>
                </Tooltip>
              ))}
            </Avatar.Group>
          }
          {!activeMembers?.length && 
            <Avatar 
              variant="filled" 
              radius="xl" 
              size="md"
            >
              <IconUserOff size="1rem" />
            </Avatar>
          }
        </Group>
        <Button.Group mt={9}>
          <Button size='xs' fw={500} fullWidth variant="light">
            Painel do projeto
          </Button>
          <Button size='xs' fw={500} fullWidth variant="light">
            Ver perfil
          </Button>
        </Button.Group>
      </Card.Section>
      <Card.Section>
        
        {/* <Flex gap={7} p={10}>
          <Button 
            size='compact-xs' 
            fw={500}
            fullWidth 
            variant='outline' 
            color='default'
            component="a"
            href={`/projects?p=${project.username}`}
          >
            Painel do projeto
          </Button>
          <Button size='compact-xs' fw={500} fullWidth variant='outline' color='default'>
            Ver perfil
          </Button>
        </Flex> */}
      </Card.Section>
    </Card>
  );
};

export default ProjectCard;