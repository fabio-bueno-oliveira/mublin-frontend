import React from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router-dom'
import { useMantineColorScheme, Container, Flex, Group, Box, Title, Text, Card, Loader, Center, Image, Avatar, Anchor, em, Button, Stack, Paper } from '@mantine/core'
import { useDocumentTitle, useMediaQuery, useFetch } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { IconCheck, IconMapPin, IconMusic, IconPlus } from '@tabler/icons-react'
import { formatDistance } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

function Job () {

  useDocumentTitle('Vaga | Mublin')

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('id');

  const { colorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const { data: job, loading: loadingJobInfo } = useFetch(
    `https://mublin.herokuapp.com/job/${jobId}`
  )

  return (
    <>
      <Helmet>
        <title>{`Vaga de ${job?.roleName} em ${job?.projectName} | Mublin`}</title>
        <link rel='canonical' href='https://mublin.com/projects' />
      </Helmet>
      <Header page='myProjects' reloadUserInfo />
      <Container
        size='lg'
        mb={130}
        pt={isMobile ? 0 : 20}
        className='myProjectsPage'
      >
        {loadingJobInfo ? (
          <Center mt={60}>
            <Loader color='mublinColor' />
          </Center>
        ) : (
          <Box>
            <Center>
              <Card
                w={isMobile ? '100%' : 500}
                key={job?.id}
                px={12} 
                py={8} 
                radius='md' 
                className='mublinModule' 
                withBorder 
              >
                <Flex gap={10} mb={14} align='center'>
                  <Anchor href={`/project/${job?.authorUsername}`}>
                    <Image 
                      src={`https://ik.imagekit.io/mublin/projects/tr:h-100,w-100,c-maintain_ratio/${job?.projectPicture}`} 
                      radius='sm'
                      width={50} 
                      height={50} 
                    />
                  </Anchor>
                  <Flex direction='column'>
                    <Title order={3} fz='0.92rem' fw={550}>
                      {job?.projectName} ({job?.projectType})
                    </Title>
                    <Flex gap={3} align='center'>
                      <Anchor href={`/${job?.authorUsername}`}>
                        <Avatar src={job?.authorPicture ? 'https://ik.imagekit.io/mublin/tr:h-50,w-50,c-maintain_ratio/users/avatars/'+job?.authorPicture : null} size='25px' title={`${job?.authorName} ${job?.authorLastname}`} />
                      </Anchor>
                      <Flex direction='column'>
                        <Text size='xs' c='dimmed'>
                          Vaga publicada por {job?.authorName} {job?.authorLastname}
                        </Text>
                        {job?.createdUNIX && 
                          <Text size='xs' c='dimmed'>
                            <Text span c='#01754f'>há {formatDistance(new Date(job?.createdUNIX * 1000), new Date(), {locale:pt})}</Text>
                          </Text>
                        }
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap={5} align='center' mb={12}>
                  <Title order={2} fz='1.5rem' fw={550}>
                    {job?.roleName}
                  </Title>
                  {job?.roleIcon && 
                    <img src={'https://ik.imagekit.io/mublin/icons/music/tr:h-26,w-26,c-maintain_ratio/'+job?.roleIcon} width='13' height='13' className={colorScheme === 'dark' ? 'invertPngColor' : undefined} />
                  }
                </Flex>
                <Text size='md' fw={550}>
                  Local da gig:
                </Text>
                <Text size='sm'>
                  Estabelecimento: {job?.venue ? job?.venue : <Text span size='sm' c='dimmed'>Nome não informado</Text>}
                </Text>
                <Group wrap='nowrap' gap={2} align='center' w='100%'>
                  <IconMapPin size={16} color='#8d8d8d' />
                  <Text size='sm' className='lhNormal' truncate='end'>
                    {job?.opportunityCityName} · {job?.opportunityRegionName} · {job?.opportunityCityCountry}
                  </Text>
                </Group>
                <Text size='md' fw={550} mt={8}>
                  Experiência sugerida:
                </Text>
                <Group gap={4}>
                  <Text size='sm'>
                    Nível {job?.experiencePTBR}
                  </Text>
                  <Group gap={1}>
                    <IconMusic size='15' color='green' />
                    <IconMusic size='15' color='green' opacity={job?.experienceId >= 2 ? 1 : 0.3} />
                    <IconMusic size='15' color='green' opacity={job?.experienceId === 3 ? 1 : 0.3} />
                  </Group>
                </Group>
                <Text size='md' fw={550} mt={8}>
                  Sobre o job:
                </Text>
                <Paper shadow='sm' p='xs'>
                  <Text size='sm'>
                    {job?.info}
                  </Text>
                </Paper>
                <Text size='md' fw={550} mt={8}>
                  Vínculo do job:
                </Text>
                <Flex gap={6} align='center' opacity={job?.relationshipId === 1 ? 1 : 0.5}>
                  <IconCheck color={job?.relationshipId === 1 ? 'green' : 'gray'} stroke='4' size='14px' />
                  <Text size='sm'>Integrante</Text>
                </Flex>
                <Flex gap={6} align='center' opacity={job?.relationshipId === 2 ? 1 : 0.5}>
                  <IconCheck color={job?.relationshipId === 2 ? 'green' : 'gray'} stroke='4' size='14px' />
                  <Text size='sm'>Contrato</Text>
                </Flex>
                <Flex gap={6} align='center' opacity={job?.relationshipId === 3 ? 1 : 0.5}>
                  <IconCheck color={job?.relationshipId === 3 ? 'green' : 'gray'} stroke='4' size='14px' />
                  <Text size='sm'>Sub</Text>
                </Flex>
                <Text size='md' fw={550} mt={8}>
                  Necessário ensaio presencial prévio?
                </Text>
                <Text size='sm'>
                  {job?.rehearsalInPerson ? 'Sim' : 'Não'}
                </Text>
                <Text size='md' fw={550} mt={8}>
                  Recorrência do trabalho:
                </Text>
                <Flex gap={6} align='center' opacity={job?.oneTimeJob === 1 ? 1 : 0.5}>
                  <IconCheck color={job?.oneTimeJob === 1 ? 'green' : 'gray'} stroke='4' size='14px' />
                  <Text size='sm'>Apenas uma apresentação</Text>
                </Flex>
                <Flex gap={6} align='center' opacity={job?.oneTimeJob === 0 ? 1 : 0.5}>
                  <IconCheck color={job?.oneTimeJob === 0 ? 'green' : 'gray'} stroke='4' size='14px' />
                  <Text size='sm'>Mais de uma apresentação</Text>
                </Flex>
                <Text size='md' fw={550} mt={8}>
                  Cachê por ensaio:
                </Text>
                {job?.feePerRehearsal > 0 ? ( 
                  <Text size='sm'>
                    {job?.feePerRehearsal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                  </Text>
                ) : (
                  <Text size='sm' c='dimmed'>
                    Não informado
                  </Text>
                )}
                <Text size='md' fw={550} mt={8}>
                  Cachê por apresentação:
                </Text>
                {job?.feePerConcert > 0 ? ( 
                  <Text size='sm'>
                    {job?.feePerConcert.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                  </Text>
                ) : (
                  <Text size='sm' c='dimmed'>
                    Não informado
                  </Text>
                )}
                <Stack
                  align='stretch'
                  justify='center'
                  gap='sm'
                  mt={22}
                >
                  <Button 
                    variant='filled' 
                    color='mublinColor'
                    component='a' 
                    href={`/project/${job?.authorUsername}`}
                  >
                    Ver página do projeto
                  </Button>
                  <Button 
                    variant='default'
                    component='a' 
                    href='/projects'
                  >
                    Ver mais vagas
                  </Button>
                </Stack>
              </Card>
            </Center>
          </Box>
        )}
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default Job