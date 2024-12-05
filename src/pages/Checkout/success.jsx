import React from 'react';
import { Container, Center, Anchor, Title, Text, Image } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';

function CheckoutSuccessPage () {

  document.title = 'Pagamento recebido | Mublin';

  return (
    <>
      <Container size={'sm'} mt={55}>
        <Center mb={26}>
          <Image src={MublinLogoBlack} h={30} />
        </Center>
        <Center my={14}>
          <IconCircleCheck size={36} color="green" />
        </Center>
        <Title order={3} ta="center">
          Agradecemos o seu pagamento!
        </Title>
        <Text size="sm" ta="center">
          A atualização do seu cadastro pode levar até 1 hora para ser refletida no seu perfil.
        </Text>
        <Center my={20}>
          <Image src={'https://ik.imagekit.io/mublin/misc/astronaut-musician-3.png?updatedAt=1731982735493'} w='160' />
        </Center>
        <Center>
          <Anchor href="https://mublin.com">
            Ir para a home do Mublin
          </Anchor>
        </Center>
      </Container>
    </>
  );
};

export default CheckoutSuccessPage;