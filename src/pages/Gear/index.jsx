import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { gearInfos } from '../../store/actions/gear';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Group, Center, Box, Title, Text, Image, Avatar, Divider, Badge, Modal, ScrollArea } from '@mantine/core';
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
      <Header />
      <Container size={'lg'} mt={largeScreen ? 20 : 0}>
        <Box mb={20}>
          <Text>
            {product.requesting ? 'Carregando marca...' : product.categoryName + ' • ' + product.brandName}
          </Text>
          <Title order={3} mb={20}>
            {product.requesting ? 'Carregando produto...' : product.name}
          </Title>
          {product.requesting ? (
            <Center className="gearProductImage">
              <Image
                radius="md"
                src={null}
                w={170}
                h={130}
                fallbackSrc="https://placehold.co/170x130?text=Carregando..."
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
        <Title order={4} mb={14}>Quem possui {product?.owners?.length && '('+product?.owners?.length+')'}</Title>
        {product.requesting ? (
          <Text>
            Carregando...
          </Text>
        ) : (
          <>
            {product?.owners?.map((owner,key) => 
              <Box key={key}>
                <Flex mb={14} gap={7}>
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
                        <Badge size='xs' color='violet'>
                          {owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                        </Badge>
                      }
                    </Group>
                  </Flex>
                </Flex>
                <Divider my="xs" />
              </Box>
            )}
          </>
        )}
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