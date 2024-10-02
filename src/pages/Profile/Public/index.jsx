import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../../../components/public/header';
import { Footer } from '../../../components/public/footer';
import { Container, Flex, Group, Image, Title, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { profileInfos } from '../../../store/actions/profile';

function PublicProfilePage () {

    const params = useParams();

    document.title = 'Mublin';

    const username = params.username;

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
        dispatch(profileInfos.getProfileProjects(username));
        dispatch(profileInfos.getProfileRoles(username));
        dispatch(profileInfos.getProfileFollowers(username));
        dispatch(profileInfos.getProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);

    console.log(29, profile);

    return (
      <>
        <Header />
        <Container size={'lg'}>
          <Flex
            mih={50}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
            py="xl"
          >
            <Image
              // maw={140}
              h={140}
              w="auto"
              fit="contain"
              radius="lg"
              src={profile.pictureLarge}
              alt={`${profile.name} ${profile.lastname}`} 
              caption={profile.username}
            />
            <div>
              <Text size="xl">{username}</Text>
              <Title order={3}>{`${profile.name} ${profile.lastname}`}</Title>
              <Text>
                {profile.roles.map((role, key) =>
                  <nobr key={key}>{role.name}{key < (profile.roles.length-1) && ', '}</nobr>
                )}
              </Text>
              <Group gap="xs">
                <Text c="dimmed">{`${profile?.followers?.length} seguidores`}</Text>
                <Text c="dimmed">{`${profile?.following?.length} seguindo`}</Text>
              </Group>
            </div>
          </Flex>
        </Container>
        <Footer />
      </>
    );
};

export default PublicProfilePage;