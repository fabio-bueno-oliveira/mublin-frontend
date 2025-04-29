import React from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router-dom'
import { useMantineColorScheme, Container, Flex, Group, Box, Title, Text, Card, Loader, Center, Image, Avatar, Anchor, em } from '@mantine/core'
import { useDocumentTitle, useMediaQuery, useFetch } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { IconMapPin } from '@tabler/icons-react'
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
        mb={isMobile ? 82 : 30}
        pt={isMobile ? 0 : 20}
        className='myProjectsPage'
      >
        {loadingJobInfo ? (
          <Center mt={30}>
            <Loader color='mublinColor' />
          </Center>
        ) : (
          <Box mt={20}>
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
                        <Avatar src={job?.authorPicture ? 'https://ik.imagekit.io/mublin/tr:h-40,w-40,c-maintain_ratio/users/avatars/'+job?.authorPicture : null} size='20px' />
                      </Anchor>
                      {job?.createdUNIX && 
                        <Text size='xs' c='dimmed'>
                          Vaga publicada por {job?.authorName} há {formatDistance(new Date(job?.createdUNIX * 1000), new Date(), {locale:pt})}
                        </Text>
                      }
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap={5} align='center' mb={12}>
                  {job?.roleIcon && 
                    <img src={'https://ik.imagekit.io/mublin/icons/music/tr:h-26,w-26,c-maintain_ratio/'+job?.roleIcon} width='13' height='13' className={colorScheme === 'dark' ? 'invertPngColor' : undefined} />
                  }
                  <Title order={2} fz='1.5rem' fw={550}>
                    {job?.roleName}
                  </Title>
                </Flex>
                <Text size='md' fw={550}>
                  Local da gig:
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
                <Text size='sm'>
                  Nível {job?.experiencePTBR}
                </Text>
                <Text size='md' fw={550} mt={8}>
                  Sobre o job:
                </Text>
                <Text size='sm'>
                  {job?.info}
                </Text>
                <Text size='xs' c='dimmed' mt={28}>
                  Publicada em {job?.created}
                </Text>
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