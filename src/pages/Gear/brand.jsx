import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { gearInfos } from '../../store/actions/gear';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Grid, Anchor, Center, BackgroundImage, Flex, Title, Avatar, Card, Image, Text, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function BrandPage () {

  const params = useParams();
  const brandUrlName = params?.brandUrlName;
  const brand = useSelector(state => state.brand);
  const largeScreen = useMediaQuery('(min-width: 60em)');

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(gearInfos.getBrandInfo(brandUrlName));
    dispatch(gearInfos.gerBrandProducts(brandUrlName));
  }, []);

  return (
    <>
      <Header />
      <Container size='lg' mt={largeScreen ? 20 : 0}>
        <Box mx='auto' h={140}>
          <BackgroundImage
            src={brand.cover ? 'https://ik.imagekit.io/mublin/products/brands/'+brand.cover : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'}
            radius='sm'
            h={134}
            // pl={40}
            pt={62}
          >
            <Flex align='center' justify='center'>
              <Avatar 
                variant='white' 
                src={brand.logo ? brand.logo : undefined} 
                alt={brand.name} 
                size='140px'
              />
              {/* <Title order={2} mt={30} c='white'>
                {brand.name}
              </Title> */}
            </Flex>
          </BackgroundImage>
        </Box>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Title order={2} mt={60}>
              {brand.name}
            </Title>
            {/* <Text size='sm' fw={500}>Website</Text> */}
            <Text size='sm'>
              <Anchor href={brand.website} target='_blank'>
                {brand.website}
              </Anchor>
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <Text size='sm'>
              {brand.description}
            </Text>
          </Grid.Col>
        </Grid>
        <Grid mb={100}>
          {brand.products.map((product, key) =>
          <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={key}>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Card.Section>
                <Center pt={20}>
                  <Link to={{ pathname: `/gear/product/${product.id}` }}>
                    <Image
                      src={product.picture}
                      h={120}
                      w='auto'
                      fit='contain'
                      alt={product.name}
                    />
                  </Link>
                </Center>
              </Card.Section>
              <Group justify='space-between' mt='md' mb='xs'>
                <Text size='sm' fw={500}>{product.name}</Text>
                {/* <Badge color='pink'>{product.categoryName}</Badge> */}
              </Group>
              <Text size='xs' c='dimmed'>
                {product.categoryName}
              </Text>
              {/* <Button color='blue' fullWidth mt='md' radius='md'>
                Usuários deste produto
              </Button> */}
            </Card>
          </Grid.Col>
          )}
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default BrandPage;