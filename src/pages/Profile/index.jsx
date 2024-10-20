import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { profileInfos } from '../../store/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Text, Image, Skeleton } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function ProfilePage () {

  const params = useParams();
  const username = params?.username;
  const profile = useSelector(state => state.profile);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username));
  }, []);

  document.title = `${profile.name} ${profile.lastname} | Mublin`;

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          {profile.requesting && 
            <>
              <Skeleton height={50} circle mb="xl" />
              <Skeleton height={18} radius="xl" />
              <Skeleton height={18} mt={6} radius="xl" />
              <Skeleton height={18} mt={6} width="70%" radius="xl" />
            </>
            
          }
          {!profile.requesting && 
            <>
              <Flex
                justify="flex-start"
                align="center"
                direction="row"
                wrap="nowrap"
                columnGap="xs"
                mt={6}
              >
                <Image
                  radius="xl"
                  h={130}
                  w="auto"
                  fit="contain"
                  src={profile.picture}
                />
                <Box>
                  <Text size='sm' c='dimmed'>{username}</Text>
                  <Title order={3}>{profile.name} {profile.lastname}</Title>
                  <Text>{profile.bio}</Text>
                </Box>
              </Flex>
            </>
          }
        </Box>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;