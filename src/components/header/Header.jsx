import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import cx from "clsx";
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconSettings, IconChevronDown } from "@tabler/icons-react";
import classes from "./Header.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.label;

  const tabItems = tabs.map((tab) => (
    <Tabs.Tab
      value={tab.label}
      key={tab.label}
      onClick={() => navigate(tab.path)}
    >
      {tab.label}
    </Tabs.Tab>
  ));

  if (!user) {
    return null;
  }

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group position="apart">
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src="https://www.kindpng.com/picc/m/317-3177437_megamind-png-transparent-png.png"
                    radius="xl"
                    size={20}
                  />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.firstname} {user.lastname}
                  </Text>
                  <IconChevronDown
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                icon={
                  <IconSettings
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                onClick={() => navigate("/profile")}
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                color="red"
                icon={
                  <IconLogout
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue={activeTab || "Home"}
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{tabItems}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
