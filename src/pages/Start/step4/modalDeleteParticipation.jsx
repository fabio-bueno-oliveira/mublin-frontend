import React from 'react';
import { Flex, Alert, Divider, Text, Group, Avatar } from '@mantine/core';

function ModalDeleteParticipationContent ({ 
    user, 
    modalDeleteData, 
    adminsModalDelete, 
    myselfAdminModalDelete
}) {

  const avatarCDNPath = 'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/';

  return (
    <>
      <Text size='sm' mb={8}>
        Tem certeza que deseja encerrar seu vínculo com este projeto? Ele não aparecerá mais no seu perfil e você não terá mais acesso ao painel de controle do projeto. Caso deseje voltar a participar no futuro, você terá que solicitar aprovação novamente.
      </Text>
      <Flex gap={3} direction={'column'} align={'center'}>
        <Avatar size='sm' src={user?.picture ? `https://ik.imagekit.io/mublin/tr:h-56,w-56,c-maintain_ratio/users/avatars/${user?.picture}` : undefined} />
        {/* <Badge variant="filled" color="gray" size="xs">Administrador</Badge> */}
        <Text size='xs' fw={500}>
          {user.name} {user.lastname} - {!!modalDeleteData?.founder && 'Fundador, '}{modalDeleteData.role1}{modalDeleteData?.role2 && `, ${modalDeleteData?.role2}`} em {modalDeleteData.name}
        </Text>
        <Text size='11px'>
          {modalDeleteData?.yearLeftTheProject && "Ex"} {modalDeleteData.workTitle} {modalDeleteData.confirmed === 2 && "(aguardando aprovação)"}
        </Text>
        <Text size='11px'>
          Atividade: de {modalDeleteData?.joined_in} 
          {(!modalDeleteData?.yearLeftTheProject && !modalDeleteData.yearEnd) && ' até o momento'}
          {(modalDeleteData?.yearLeftTheProject) && ` até ${modalDeleteData?.yearLeftTheProject}`}
          {(!modalDeleteData?.yearLeftTheProject && modalDeleteData.yearEnd) && ` até o encerramento em ${modalDeleteData.yearEnd}`}
        </Text>
      </Flex>
      <Divider my="sm" label="Administradores:" labelPosition="left" />
      {adminsModalDelete.length ? (
        <Group gap={9}>
          {adminsModalDelete.map((admin, key) => 
            <Flex key={key} gap={3}>
              <Avatar size='xs' src={admin.userPicture ? `${avatarCDNPath}/${admin.userPicture}` : undefined} />
              <Text size='xs'>{admin.userName}</Text>
            </Flex>
          )}
        </Group>
      ) : (
        <Text size='xs'>Nenhum administrador localizado</Text>
      )}
      {(myselfAdminModalDelete?.length === 1 && adminsModalDelete?.length === 1) &&
        <Alert p={8} mt={10} variant="light" color="red">
          <Text size='xs'>Você é o único administrador deste projeto! Para deletar definitivamente o projeto, utilize o painel de controle do projeto.</Text>
        </Alert>
      }
    </>
  );
};

export default ModalDeleteParticipationContent;