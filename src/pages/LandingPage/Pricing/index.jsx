import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Header from '../../../components/header/public'
import Footer from '../../../components/footer/public'
import { Container, Flex, Card, Group, Badge, Divider, Box, Text, Title, Button, Accordion, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconPhoto } from '@tabler/icons-react'
import './styles.scss'

function PricingPublicPage () {

  document.title = 'Mublin'

  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Preços | Mublin</title>
        <link rel='canonical' href={`https://mublin.com/pricing`} />
        <meta name='description' content='A rede para quem trabalha com música' />
      </Helmet>
      {loggedIn &&
        <Navigate to='/home' />
      }
      <Box bg='black' c='white' py='14'>
        <Text ta='center' size={isMobile ? '12px' : '15px'} fw='330' c='dimmed'>
          🚀 40% off no lançamento: Mublin PRO por 3 meses
        </Text>
      </Box>
      <Header />
      <Container size='sm' my={32}>
        <Title 
          size='2rem'
          fw='700'
          ta='center'
          mb={8}
        >
          Assine e seja PRO
        </Title>
        <Text 
          size='md'
          className='lhNormal'
          ta='center' 
          fw='330'
        >
          Conecte-se com outros artistas e produtores. Centralize o gerenciamento dos seus projetos de música em um só lugar e simplifique o seu dia a dia na música com apenas alguns cliques.
        </Text>
      </Container>
      <Container size='sm'>
        <Flex align='flex-start' justify='center' direction='row' gap={14}>
          <Card h={isMobile ? 550 : 400} shadow='sm' padding='lg' radius='md' withBorder style={{flex:1}}>
            <Flex direction='column' justify='space-between' h='100%'>
              <div>
                <Card.Section px={18}>
                  <Group justify='space-between' mt='md' mb='xs'>
                    <Text fw={500}>Plano Free</Text>
                    <Badge color='gray'>Gratuito</Badge>
                  </Group>
                  <Text size='1.8rem' fw={600} variant='gradient' gradient={{ from: 'gray', to: 'rgba(126, 134, 194, 1)', deg: 107 }}>
                    R$ 0,00 <Text span fz='xs'>pra sempre</Text>
                  </Text>
                  <Text size='xs' mb={10}>
                    Acesso gratuito para sempre para você se conectar com  profissionais da música
                  </Text>
                  <Divider my={12} />
                  <Text size='xs' mb={10} fw={500}>
                    Conta gratuita para conectar com artistas, produtores e projetos
                  </Text>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Encontre gigs e projetos para tocar</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='#8dcf98' stroke='4' size='14px' />
                    <Text size='sm'>Até 2 projetos</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='#CDCDCD' stroke='4' size='14px' />
                    <Text size='sm'>Equipamentos e setups no perfil</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='#CDCDCD' stroke='4' size='14px' />
                    <Text size='sm'>Parceiros e endorsers no perfil</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Veja quem votou seus pontos fortes</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='#CDCDCD' stroke='4' size='14px' />
                    <Text size='sm'>Selo azul verificado</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='#8dcf98' stroke='4' size='14px' />
                    <Text size='sm'>Suporte via FAQ</Text>
                  </Flex>
                </Card.Section>
              </div>
              <Button color='dark' variant='outline' fullWidth mt='md' radius='md'>
                Grátis para sempre
              </Button>
            </Flex>
          </Card>
          <Card h={isMobile ? 550 : 400} shadow='sm' padding='lg' radius='md' withBorder style={{flex:1}}>
            <Flex direction='column' justify='space-between' h='100%'>
              <div>
                <Card.Section px={18}>
                  <Group justify='space-between' mt='md' mb='xs'>
                    <Text fw={500}>Plano PRO</Text>
                    <Badge color='violet' variant='light'>
                      40% off
                    </Badge>
                  </Group>
                  <Text size='1.8rem' fw={600} variant='gradient' gradient={{ from: 'violet', to: 'yellow', deg: 107 }}>
                    R$ 29,90 <Text span fz='xs'>por 3 meses</Text>
                  </Text>
                  <Text size='xs' mb={10}>
                    Pagamento único (não recorrente) válido por 3 meses. Após isso, se desejar, poderá renovar.
                  </Text>
                  <Divider my={12} />
                  <Text size='xs' mb={10} fw={500}>
                    Todos os recursos, incluindo cadastro de equipamento e projetos ilimitados.
                  </Text>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Encontre gigs e projetos para tocar</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Projetos ilimitados</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Equipamentos e setups no perfil</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Parceiros e endorsers no perfil</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Veja quem votou seus pontos fortes</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Selo azul verificado</Text>
                  </Flex>
                  <Flex gap={10} align='center'>
                    <IconCheck color='green' stroke='4' size='14px' />
                    <Text size='sm'>Suporte personalizado</Text>
                  </Flex>
                </Card.Section>
              </div>
              <Button 
                variant='gradient'
                gradient={{ from: 'violet', to: 'indigo', deg: 90 }} 
                fullWidth 
                mt='md' 
                radius='md'
              >
                Book classic tour now
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Container>

      <Container size='sm' my={30}>
        <Accordion variant="contained">
          <Accordion.Item value="photos">
            <Accordion.Control icon={<IconPhoto size={20} color="var(--mantine-color-red-6)" />}>
              Recent photos
            </Accordion.Control>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="print">
            <Accordion.Control icon={<IconPhoto size={20} color="var(--mantine-color-blue-6)" />}>
              Print photos
            </Accordion.Control>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="camera">
            <Accordion.Control
              icon={<IconPhoto size={20} color="var(--mantine-color-teal-6)" />}
            >
              Camera settings
            </Accordion.Control>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>

      <Footer />
    </>
  )
}

export default PricingPublicPage