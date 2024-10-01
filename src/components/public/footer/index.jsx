import { Container, Anchor, Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandInstagram } from '@tabler/icons-react';
import classes from './FooterCentered.module.css';

const links = [
  { link: '#', label: 'Sobre' },
  { link: '#', label: 'Contato' },
  { link: '#', label: 'Trabalhe no Mublin' },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <Container size={'lg'}>
    <div className={classes.footer}>
      <div className={classes.inner}>
        Mublin

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon 
            size="lg"
            variant="default"
            radius="xl"
            component="a"
            target="blank"
            href="https://instagram.com/mublin"
          >
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
    </Container>
  );
}