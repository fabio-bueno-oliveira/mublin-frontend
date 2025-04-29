import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Header from '../../../components/header/public'
import Footer from '../../../components/footer/public'
import { Container, Flex, Card, Group, Badge, Divider, Box, Text, Title, Button, Accordion, Grid, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconCreditCard, IconMessage, IconRosetteDiscountCheck } from '@tabler/icons-react'

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
          🚀 40% off no lançamento: Mublin PRO
        </Text>
      </Box>
      <Header />
      <Container size='sm' my={32}>
        <Title 
          size='2rem'
          fw='800'
          ta='center'
          mb={8}
        >
          Seja PRO
        </Title>
        <Text 
          size='md'
          className='lhNormal'
          ta='center' 
          fw='400'
        >
          Conecte-se com outros artistas e produtores. Gerencie dos seus projetos de música e amplie suas possibilidades no mercado musical
        </Text>
      </Container>
      <Container size='sm'>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Flex direction='column' justify='space-between' h='100%'>
                <Box mb={6}>
                  <Card.Section px={18}>
                    <Group justify='space-between' mt='md' mb='xs'>
                      <Text fw={500}>Plano Free</Text>
                      <Badge color='green' variant='light'>Gratuito</Badge>
                    </Group>
                    <Text size='1.8rem' fw={600} variant='gradient' gradient={{ from: 'gray', to: 'rgba(126, 134, 194, 1)', deg: 107 }}>
                      R$ 0,00 <Text span fz='xs'>pra sempre</Text>
                    </Text>
                    <Text size='sm' mb={10}>
                      Acesso gratuito para sempre para você se conectar com  profissionais da música.
                    </Text>
                    <Divider my={12} />
                    {/* <Text size='xs' mb={10} fw={500}>
                      Conta gratuita para conectar com artistas, produtores e projetos
                    </Text> */}
                    <Flex gap={10} align='center'>
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Busque gigs e projetos</Text>
                    </Flex>
                    <Flex gap={10} align='center'>
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Até 2 projetos</Text>
                    </Flex>
                    <Flex gap={10} align='center'>
                      <IconCheck color='#CDCDCD' stroke='4' size='14px' />
                      <Text size='sm'>Cadastre seus equipamentos</Text>
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
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Suporte via FAQ</Text>
                    </Flex>
                  </Card.Section>
                </Box>
                <Button 
                  color='primary' 
                  variant='outline' 
                  fullWidth 
                  mt='xl' 
                  radius='md'
                  component='a'
                  href='/signup'
                >
                  Free
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Flex direction='column' justify='space-between' h='100%'>
                <Box mb={6}>
                  <Card.Section px={18}>
                    <Group justify='space-between' mt='md' mb='xs'>
                      <Text fw={500}>Plano PRO</Text>
                      <Badge color='violet' variant='light'>
                        40% off
                      </Badge>
                    </Group>
                    <Text size='1.8rem' fw={600} variant='gradient' gradient={{ from: 'violet', to: 'yellow', deg: 107 }}>
                      R$ 14,90 <Text span fz='xs'>/mês</Text>
                    </Text>
                    <Text size='sm' mb={10}>
                      Perfil otimizado com todas as funcionalidades da plataforma + selo usuário verificado. Cobrança recorrente, podendo ser cancelada a qualquer momento.
                    </Text>
                    <Divider my={12} />
                    {/* <Text size='xs' mb={10} fw={500}>
                      Todos os recursos, incluindo cadastro de equipamento e projetos ilimitados.
                    </Text> */}
                    <Flex gap={10} align='center'>
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Busque gigs e projetos</Text>
                    </Flex>
                    <Flex gap={10} align='center'>
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Projetos ilimitados</Text>
                    </Flex>
                    <Flex gap={10} align='center'>
                      <IconCheck color='green' stroke='4' size='14px' />
                      <Text size='sm'>Cadastre seus equipamentos</Text>
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
                </Box>
                <Button 
                  color='mublinColor'
                  fullWidth 
                  mt='xl' 
                  radius='md'
                  component='a'
                  href='/signup'
                >
                  Quero ser PRO
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
      <Container size='sm' my={30}>
        <Accordion variant="contained">
          <Accordion.Item value="photos">
            <Accordion.Control icon={<IconCreditCard size={20} color="gray" />}>
              O pagamento do plano PRO é recorrente?
            </Accordion.Control>
            <Accordion.Panel>Sim. O pagamento é cobrado de forma recorrente. Você poderá cancelar a assinatura a qualquer momento.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="print">
            <Accordion.Control icon={<IconRosetteDiscountCheck size={20} color="gray" />}>
              Como posso ter o selo de perfil verificado? 
            </Accordion.Control>
            <Accordion.Panel>O selo de perfil verificado é atribuído para usuários que possuem uma conta Mublin PRO e que passam por um processo de verificação de identidade</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="camera">
            <Accordion.Control
              icon={<IconMessage size={20} color="gray" />}
            >
              Como funciona o suporte do Mublin?
            </Accordion.Control>
            <Accordion.Panel>Dúvidas e solicitações devem ser enviadas para help@mublin.com</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Footer />
    </>
  )
}

export default PricingPublicPage