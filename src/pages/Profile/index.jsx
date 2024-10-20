import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { profileInfos } from '../../store/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Flex, Title, Text, Image, Skeleton, Center } from '@mantine/core';
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
        <Center>
          <Image
            radius="xl"
            h={130}
            w="auto"
            fit="contain"
            src={profile.picture}
          />
        </Center>
        {/* {profile.requesting && 
          <>
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={18} radius="xl" />
            <Skeleton height={18} mt={6} radius="xl" />
            <Skeleton height={18} mt={6} width="70%" radius="xl" />
          </>
        } */}
        {!profile.requesting && 
          <Container size={'sm'} mt={20}>
            <Text size='sm' c='dimmed' align='center'>{username}</Text>
            <Title order={3} align='center'>{profile.name} {profile.lastname}</Title>
            <Text align='center'>{profile.bio}</Text>
          </Container>
        }
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default ProfilePage;