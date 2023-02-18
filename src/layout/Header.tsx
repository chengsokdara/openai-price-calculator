import { Badge, changeTheme, Navbar, Text, useTheme } from '@nextui-org/react'
import { Row } from '@ui'
import NavItem from '@ui/button/NavItem'
import NavLink from '@ui/button/NavLink'
import UserDropdown from '@ui/dropdown/UserDropdown'
import Logo from '@ui/image/Logo'
import { signOut } from 'firebase/auth'
import { useCallback, useState, type Key } from 'react'
import { auth } from 'src/firebase'
import { useUser } from 'src/hooks/useUser'
import { pages, type TPage } from 'src/layout/Routes'
import { useLocation } from 'wouter'

function Header() {
  const [, navigate] = useLocation()
  const [toggle, setToggle] = useState<boolean>(false)
  const { isDark } = useTheme()
  const user = useUser()

  const onAction = useCallback(
    async (key: Key) => {
      switch (key) {
        case 'dark-mode':
          const nextTheme = isDark ? 'light' : 'dark'
          localStorage.setItem('data-theme', nextTheme) // you can use any storage
          changeTheme(nextTheme)
          break
        case 'login':
          navigate('/auth/signin')
          break
        case 'logout':
          signOut(auth)
            .then(() => {
              localStorage.clear()
            })
            .catch((err) => {
              console.error(err)
            })
          break
        default:
      }
    },
    [isDark]
  )

  const renderNavItems = ({ key, matcher, path, title }: TPage) => (
    <NavItem
      key={key}
      href={path}
      matcher={matcher}
      onPress={() => setToggle(!toggle)}
    >
      <Text b>{title}</Text>
    </NavItem>
  )

  const renderNavLinks = ({ key, matcher, path, title }: TPage) => (
    <NavLink id={key} key={key} href={path} matcher={matcher}>
      <Text b>{title}</Text>
    </NavLink>
  )

  return (
    <Row
      css={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        '@xsMax': { pt: '$xs' },
      }}
    >
      <Navbar isBordered variant="floating">
        <Navbar.Toggle
          aria-label="Menu Toggle"
          isSelected={toggle}
          showIn="xs"
          onChange={(isSelected) => setToggle(isSelected as boolean)}
        />
        <Logo />
        <Navbar.Content
          css={{
            ai: 'flex-start',
            fg: 1,
            px: '$xl',
            '@xsMax': { px: '$sm' },
          }}
          activeColor="secondary"
          hideIn="xs"
          variant="underline-rounded"
        >
          {pages.filter(({ hide }) => !hide).map(renderNavLinks)}
        </Navbar.Content>
        {toggle ? (
          <Navbar.Collapse showIn="xs">
            {pages.filter(({ hide }) => !hide).map(renderNavItems)}
          </Navbar.Collapse>
        ) : null}
        <Navbar.Content>
          {user?.admin ? (
            <Badge
              color="error"
              content="admin"
              isInvisible={!user.admin}
              size="xs"
            >
              <UserDropdown onAction={onAction} />
            </Badge>
          ) : (
            <UserDropdown onAction={onAction} />
          )}
        </Navbar.Content>
      </Navbar>
    </Row>
  )
}

export default Header
