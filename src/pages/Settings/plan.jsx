import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Container, Badge, Card, Box, Flex, Group, Button, Divider, Title, Text, Skeleton, Anchor, Table } from '@mantine/core'
import { IconChevronLeft, IconLockSquareRoundedFilled, IconCheck } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'

function SettingsMyPlan () {

  document.title = 'Meu plano | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id
  const loggedUserEmail = decoded.result.email

  const user = useSelector(state => state.user)

  const [planInfoLoaded, setPlanInfoLoaded] = useState(false)

  const [planInfo, setPlanInfo] = useState({
    id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    planId: '',
    planCreatedIn: '',
    planExpiresIn: '',
    method: '',
    paymentIdentifier: '',
    service: '',
  })

  useEffect(() => { 
    fetch('https://mublin.herokuapp.com/userInfo/plan', {
      method: 'GET',
      headers: new Headers({
          'Authorization': 'Bearer '+token
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
          setPlanInfoLoaded(true)
          setPlanInfo(result)
        },
        (error) => {
          setPlanInfoLoaded(true)
          console.error(error)
        }
      )
  }, [dispatch, loggedUserId])

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          <Grid.Col span={4} pt={20} className='showOnlyInLargeScreen'>
            <SettingsMenu page='plan' />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={6} className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Flex gap={2} direction='column'>
                <Text 
                  mr='10' 
                  className='lhNormal'
                  truncate='end'
                  size='1.10rem'
                  fw='600'
                >
                  Minha assinatura
                </Text>
                <Text size='sm' c='dimmed' mb={14}>
                  Dados do meu plano no Mublin
                </Text>
              </Flex>
            </Flex>
            <Box>
              <Card 
                shadow='sm' 
                p={14} 
                withBorder 
                mb={20} 
                display='block' 
                className='mublinModule'
              >
                <Box className='showOnlyInLargeScreen'>
                  <Title order={4}>
                    Minha assinatura
                  </Title>
                  <Text size='sm' c='dimmed' mb={14}>
                    Dados do meu plano no Mublin
                  </Text>
                  <Divider my={12} />
                </Box>
                {!planInfoLoaded ? (
                  <Flex direction='column' gap={8}>
                    <Skeleton height={8} width={80} radius="lg" />
                    <Skeleton height={8} width={65} radius="lg" />
                  </Flex>
                ) : (
                  <Box>
                    <Text size='sm'>
                      <Text span fw={550}>Nome:</Text> {planInfo.name} {planInfo.lastname}
                    </Text>
                    <Text size='sm'>
                      <Text span fw={550}>Email:</Text> {planInfo.email}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Divider my={14} />
                  <Table.ScrollContainer minWidth={500}>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Plano</Table.Th>
                          <Table.Th>Criação do plano atual</Table.Th>
                          <Table.Th>Expira em</Table.Th>
                          <Table.Th>Método de aquisição</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {!planInfoLoaded ? (
                          <Table.Tr>
                            <Table.Td><Skeleton height={10} width={100} radius="lg" /></Table.Td>
                            <Table.Td><Skeleton height={10} width={100} radius="lg" /></Table.Td>
                            <Table.Td><Skeleton height={10} width={100} radius="lg" /></Table.Td>
                            <Table.Td>
                              <Skeleton height={10} width={100} radius="lg" />
                            </Table.Td>
                          </Table.Tr>
                        ) : (
                          <Table.Tr>
                            <Table.Td>
                              {
                                planInfo.planId === 1 
                                ? <Text fz='sm'>Gratuito</Text> 
                                : <Badge 
                                    radius='sm' 
                                    size='sm' 
                                    color='secondary' 
                                    variant='gradient'
                                    gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                                  >
                                    PRO
                                  </Badge>
                              }
                            </Table.Td>
                            <Table.Td fz='sm'>{planInfo.planCreatedIn}</Table.Td>
                            <Table.Td fz='sm'>{planInfo.planId === 2 ? planInfo.planExpiresIn : '--'}</Table.Td>
                            <Table.Td>
                              {planInfo.planId === 2 ? (
                                {
                                  1: <Text fz='sm'>Pagamento via checkout</Text>,
                                  2: <Text fz='sm'>Pagamento via checkout</Text>,
                                  3: <Text fz='sm'>Pagamento via checkout</Text>,
                                  4: <Text>Voucher</Text>,
                                  5: <Text fz='sm'>Cortesia</Text>
                                }[planInfo.method]
                              ) : (
                                <Text fz='sm'>Cadastro comum</Text>
                              )}
                            </Table.Td>
                          </Table.Tr>
                        )}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Box>
                {planInfo.planId === 1 && 
                  <Box mt={16}>
                    {/* <Anchor
                      variant='gradient'
                      gradient={{ from: 'violet', to: 'blue' }}
                      fw='500'
                      fz='md'
                      ta='center'
                      underline='hover'
                      href={`https://buy.stripe.com/eVaeYmgTefuu8SsfYZ?client_reference_id=${loggedUserId}&prefilled_email=${loggedUserEmail}&utm_source=profileGearSection`} 
                      target='_blank'
                    >
                      Assine o Mublin PRO!
                    </Anchor> */}
                    <Button
                      variant='gradient'
                      gradient={{ from: 'violet', to: 'blue' }}
                      size='sm'
                      fullWidth
                      component='a'
                      href={`https://buy.stripe.com/eVaeYmgTefuu8SsfYZ?client_reference_id=${loggedUserId}&prefilled_email=${loggedUserEmail}&utm_source=profileGearSection`} 
                      target='_blank'
                    >
                      Assine o Mublin PRO!
                    </Button>
                    <Grid mt={14}>
                      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <Card shadow='sm' padding='lg' radius='md' withBorder className='mublinModule'>
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
                                <Text size='xs' mb={10}>
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
                          </Flex>
                        </Card>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <Card shadow='sm' padding='lg' radius='md' withBorder className='mublinModule'>
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
                                  R$ 29,90 <Text span fz='xs'>por 3 meses</Text>
                                </Text>
                                <Text size='xs' mb={10}>
                                  Pagamento único (não recorrente) para <nobr>3 meses</nobr> de PRO. Renovação opcional.
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
                          </Flex>
                        </Card>
                      </Grid.Col>
                    </Grid>
                  </Box>
                }
                {planInfo.planId === 2 && 
                  <Box mt={10}>
                    <Text fw={650} size='xs' c='dimmed'>
                      Cancelamento de plano PRO
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Para cancelar seu plano PRO adquirido e pago via tela de pagamento (checkout), é preciso acessar sua conta na <a href='https://stripe.com/br' target='_blank'>Stripe</a> e cancelar a recorrência.
                    </Text>
                    <Text size='xs' c='dimmed'>
                      O cancelamento de planos PRO concedidos via voucher ou cortesia será realizado automaticamente na data de expiração.
                    </Text>
                    <Text mt={10} size='xs' c='dimmed'>Para suporte, envie um email para help@mublin.com</Text>
                  </Box>
                }
              </Card>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsMyPlan