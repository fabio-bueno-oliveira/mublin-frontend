import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { Grid, Container, Card, Box, Flex, Group, Image, Divider, Title, Text, Button, CloseButton, Skeleton, Badge, Anchor, Modal, Alert, NativeSelect, Checkbox, NumberInput, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useForm, isNotEmpty } from '@mantine/form'
import { IconChevronLeft, IconPlus, IconXboxX, IconInfoCircle, IconLockSquareRoundedFilled } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'

function SettingsMyPlan () {

  document.title = 'Parceiros e Endorsements | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const user = useSelector(state => state.user)
  const gear = useSelector(state => state.gear)

  useEffect(() => { 
    dispatch(userActions.getInfo())
    dispatch(userActions.getUserPartners())
    dispatch(miscInfos.getGearBrands())
  }, [dispatch, loggedUserId])

  const currentYear = new Date().getFullYear()
  const [isLoading, setIsLoading] = useState(false)

  const [modalNew, setModalNew] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      brandId: '',
      featured: '',
      type: '',
      since_year: currentYear
    },

    validate: {
      brandId: isNotEmpty('Informe a marca parceira'),
      type: isNotEmpty('Informe o tipo da parceira'),
      since_year: isNotEmpty('Informe o ano de início da parceria')
    },
  });

  const handleSubmitNewPartnership = (values) => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/add/partnership', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        userId: loggedUserId, brandId: values.brandId, featured: values.featured ? 1 : 0, type: values.type, since_year: values.since_year
      })
    })
    .then(res => res.json())
    .then((result) => {
      setIsLoading(false)
      setModalNew(false)
      dispatch(userActions.getUserPartners())
      notifications.show({
        position: 'top-center',
        color: 'green',
        title: 'Tudo certo!',
        message: 'A marca parceira foi vinculada com sucesso ao seu perfil',
      });
      form.reset();
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
      setModalNew(false)
      notifications.show({
        position: 'top-center',
        color: 'green',
        title: 'Tudo certo!',
        message: 'Ocorreu um erro ao vincular a marca parceira ao seu perfil. Tente novamente em instantes',
      })
    })
  }

  const [brandToRemove, setBrandToRemove] = useState({partnershipId: '', brandName: ''})

  const openModalConfirmation = (partnershipId, brandName) => {
    setModalConfirm(true)
    setBrandToRemove({partnershipId: partnershipId, brandName: brandName})
  }

  const deletePartnership = (partnershipId) => {
    setIsLoading(true)
    fetch('https://mublin.herokuapp.com/user/delete/partnership', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userPartnershipId: partnershipId})
    })
    .then((response) => {
      setIsLoading(false)
      setModalConfirm(false)
      notifications.show({
        autoClose: 2000,
        title: 'Certo!',
        message: 'O parceiro foi desvinculado do seu perfil com sucesso',
        color: 'lime',
        position: 'top-center'
      })
      dispatch(userActions.getUserPartners())
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
      setModalConfirm(false)
      notifications.show({
        autoClose: 2000,
        title: 'Ops',
        message: 'Ocorreu um erro ao remover a parceria. Tente novamente em instantes',
        color: 'red',
        position: 'top-center'
      })
    })
  }

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          <Grid.Col span={4} pt={20} className='showOnlyInLargeScreen'>
            <SettingsMenu page='endorsements' />
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
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }} className='showOnlyInLargeScreen'>
                    <Title order={4}>
                      Parceiros e Endorsements
                    </Title>
                    <Text size='sm' c='dimmed' mb={14}>
                      Marcas que apoiam meu trabalho
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }} ta={isMobile ? 'left' : 'right'}>
                    {user.plan === 'Pro' ? ( 
                      <Button 
                        size='md' 
                        color='mublinColor' 
                        leftSection={<IconPlus size={14} />}
                        onClick={() => setModalNew(true)}
                        fullWidth={isMobile ? true : false}
                      >
                        Vincular nova marca
                      </Button>
                    ) : (
                      <Button 
                        mb={10} 
                        size='sm' 
                        disabled 
                        leftSection={<IconPlus size={14} />}
                        fullWidth={isMobile ? true : false}
                      >
                        Vincular nova marca
                      </Button>
                    )}
                  </Grid.Col>
                </Grid>
                {(user.success && user.plan !== 'Pro') && 
                  <Group gap={6}>
                    <IconLockSquareRoundedFilled size={28} />
                    <Flex direction='column' gap={3}>
                      <Text size='sm'>
                        Apenas usuários com plano PRO podem adicionar e exibir marcas parceiras.
                      </Text>
                      <Anchor
                        fw='420'
                        fz='sm'
                        href='/pro'
                        underline='hover'
                        variant='gradient'
                        gradient={{ from: 'pink', to: 'yellow' }}
                      >
                        Assine o Mublin PRO!
                      </Anchor>
                    </Flex>
                  </Group>
                }
                <Divider my={12} />
                {user.requesting ? (
                  <Flex gap={8} align='center'>
                    <Skeleton height={60} width={60} radius='lg' />
                    <Flex direction='column'>
                      <Skeleton height={14} width={100} mb={8} radius="lg" />
                      <Skeleton height={10} width={100} radius="lg" />
                    </Flex>
                  </Flex>
                ) : (
                  <>
                    {user.partners.total === 0 ? (
                      <Text size='sm' c='dimmed'>Nenhuma marca vinculada no momento</Text>
                    ) : (
                      <>
                        <Text size='md' mb={10}>
                          {user.partners.total === 1 ? user.partners.total + ' marca vinculada' : user.partners.total + ' marcas vinculadas'}
                        </Text>
                        {user.partners.result.map((brand =>
                          <Flex gap={8} align='center' key={brand.id} mb={14}>
                            <Link to={`/company/${brand.slug}`}>
                              <Image
                                src={brand.logo ? `https://ik.imagekit.io/mublin/products/brands/tr:h-120,w-120,cm-pad_resize,bg-FFFFFF/${brand.logo}` : undefined}
                                h={60}
                                w={60}
                                radius='md'
                              />
                            </Link>
                            <Flex direction='column'>
                              <Group gap={1}>
                                <Text size='md' fw={600}>{brand.name}</Text>
                                <CloseButton 
                                  title='Desvincular' 
                                  icon={<IconXboxX color='red' size={15} stroke={1.5} />} 
                                  onClick={() => openModalConfirmation(brand.keyId, brand.name)}
                                />
                              </Group>
                              <Group gap={4} mb={4}>
                                <Text size='xs'>Tipo da parceria:</Text>
                                <Badge size='xs' variant="dot" color={brand.type === "Endorser" ? "lime" : "#cacaca"}>Endorser</Badge>
                                <Badge size='xs' variant="dot" color={brand.type === "Parceiro" ? "lime" : "#cacaca"}>Parceiro</Badge>
                              </Group>
                              <Text size='xs' mb={4}>
                                Ano do início da parceria: {brand.sinceYear}
                              </Text>
                              <Text size='11px' c='dimmed'>
                                Cadastrado em {brand.created}
                              </Text>
                            </Flex>
                          </Flex>
                        ))}
                      </>
                    )}
                  </>
                )}
              </Card>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <Modal
        withCloseButton={false}
        opened={modalNew}
        onClose={() => setModalNew(false)}
        size='xs'
      >
        <Alert variant='light' color='orange' icon={<IconInfoCircle />} mb={10}>
          <Text size='xs'>O Mublin não verifica a parceria junto às marcas mencionadas, porém o vínculo pode ser removido imediatamente no caso de solicitação da marca ou parceria não existente</Text>
        </Alert>
        <form onSubmit={form.onSubmit(handleSubmitNewPartnership)}>
          <NativeSelect
            size='md'
            label='Selecione a marca parceira'
            key={form.key('brandId')}
            {...form.getInputProps('brandId')}
          >
            {gear.requesting ? ( 
              <option>Carregando...</option>
            ) : (
              <option value=''>Selecione</option>
            )}
            {gear.brands.map((brand,key) =>
              <option
                key={key}
                value={brand.id}
                disabled={!!user.partners.result.filter((x) => { return x.id === Number(brand.id)}).length}
              >
                {brand.name}
              </option>
            )}
          </NativeSelect>
          <NumberInput
            mt={6}
            size='md'
            label='Ano de início da parceria'
            min={1900} 
            max={currentYear}
            key={form.key('since_year')}
            {...form.getInputProps('since_year')}
          />
          <NativeSelect
            mt={6}
            size='md'
            label='Tipo de parceria'
            key={form.key('type')}
            {...form.getInputProps('type')}
          >
            <option value=''>Selecione</option>
            <option value='1'>Endorser</option>
            <option value='2'>Parceiro</option>
          </NativeSelect>
          <Checkbox
            mt='sm'
            color='mublinColor'
            label='Em destaque (exibir entre as primeiras)'
            key={form.key('featured')}
            {...form.getInputProps('featured', { type: 'checkbox' })}
          />
          <Group justify='flex-end' gap={7} mt={20}>
            <Button variant='outline' color='gray' size='md' onClick={() => setModalNew(false)}>
              Cancelar
            </Button>
            <Button color='mublinColor' size='md' type="submit" loading={isLoading}>
              Salvar
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        withCloseButton={false}
        opened={modalConfirm}
        onClose={() => setModalConfirm(false)}
        size='xs'
        centered
      >
        <Text>
          Tem certeza que deseja desvincular a marca <strong>{brandToRemove.brandName}</strong> do seu perfil?
        </Text>
        <Group justify='flex-end' gap={7} mt={20}>
          <Button variant='outline' color='gray' size='sm' onClick={() => setModalConfirm(false)}>
            Cancelar
          </Button>
          <Button color='red' size='sm' onClick={() => deletePartnership(brandToRemove.partnershipId)} loading={isLoading}>
            Remover
          </Button>
        </Group>
      </Modal>
      {(!modalConfirm && !modalNew) &&
        <FooterMenuMobile />
      }
    </>
  )
}

export default SettingsMyPlan