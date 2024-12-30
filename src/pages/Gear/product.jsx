import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { gearInfos } from '../../store/actions/gear';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Flex, Paper, Group, Center, Box, Title, Text, Image, Avatar, Divider, Badge, Modal, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function GearProductPage () {

  const params = useParams();
  const productId = params?.productId;
  const product = useSelector(state => state.gear);
  const largeScreen = useMediaQuery('(min-width: 60em)');

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(gearInfos.getProductInfo(productId));
    dispatch(gearInfos.getProductOwners(productId));
  }, []);

  const [modalZoomOpen, setModalZoomOpen] = useState(false);

  return (
    <>
      <Header showBackIcon={true} />
      <Container size={'lg'} mt={largeScreen ? 20 : 0}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Box mb={20}>
              <Text mb='3' size='sm' c='dimmed'>
                {product.requesting ? 'Carregando marca...' : product.categoryName}
              </Text>
              <Link to={{ pathname: `/gear/brand/${product.brandSlug}` }} className='websiteLink'>
                {product.brandName}
              </Link>
              <Title order={4} fw='450' mb={20}>
                {product.requesting ? 'Carregando produto...' : product.name}
              </Title>
              {product.requesting ? (
                <Center className='gearProductImage'>
                  <Image
                    radius='md'
                    src={null}
                    w={170}
                    h={130}
                    fallbackSrc='https://placehold.co/170x130?text=Carregando...'
                  />
                </Center>
              ) : (
                <Center className="gearProductImage">
                  <Image 
                    src={product.picture ? product.picture : undefined}
                    rounded
                    w={170}
                    onClick={() => setModalZoomOpen(true)}
                    style={{cursor:'pointer'}}
                  />
                </Center>
              )}
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Title order={5} fw='450' mb={14}>
              Quem possui: {product?.owners?.length && '('+product?.owners?.length+')'}
            </Title>
            {product.requesting ? (
              <Text>
                Carregando...
              </Text>
            ) : (
              <>
                {product.owners[0].id && 
                  product?.owners?.map(owner => 
                    <Paper 
                      key={owner.id}
                      radius='md'
                      withBorder
                      px='12'
                      py='12'
                      mb='12'
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Flex gap={7}>
                        <Link to={{ pathname: `/${owner.username}` }}>
                          <Avatar.Group>
                            <Avatar size='lg' src={owner.picture} />
                            <Avatar src={product.picture} />
                          </Avatar.Group>
                        </Link>
                        <Flex
                          justify="flex-start"
                          align="flex-start"
                          direction="column"
                          wrap="wrap"
                        >
                          <Text size='sm' fw={500}>
                            {owner.name+' '+owner.lastname}
                          </Text>
                          <Text size='xs'>
                            {owner.city && <span>{owner.city}/{owner.region}</span>}
                          </Text>
                          <Group gap={3}>
                            {!!owner.currentlyUsing && 
                              <Badge size='xs' color='dark'>Em uso</Badge>
                            } 
                            {!!owner.forSale && 
                              <Badge size='xs' color='violet'>À venda</Badge>
                            } 
                            {!!owner.price && 
                              <Text size='xs'>
                                {owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                              </Text>
                            }
                          </Group>
                        </Flex>
                      </Flex>
                      <Text size='xs' mt='xs' c='dimmed'>Comentários de {owner.name} sobre este item</Text>
                      {owner.ownerComments ? (
                        <Text size='sm'>
                          {owner.ownerComments}
                        </Text>
                      ) : (
                        <Text size='sm'>
                          {`Nenhum comentário de ${owner.name} sobre este item até o momento`}
                        </Text>
                      )}
                    </Paper>
                  )
                }
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Modal 
        centered
        opened={modalZoomOpen} 
        title={product.brandName + ' | ' + product.name}
        onClose={() => setModalZoomOpen(false)} 
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Image src={product.largePicture} onClick={() => setModalZoomOpen(false)} />
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default GearProductPage;