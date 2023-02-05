import {
  Button,
  changeTheme,
  Col,
  Navbar,
  Row,
  Text,
  useTheme,
} from '@nextui-org/react'
import NavLink from './NavLink'

function NavBar() {
  const { isDark } = useTheme()

  const handleChange = () => {
    const nextTheme = isDark ? 'light' : 'dark'
    window.localStorage.setItem('data-theme', nextTheme) // you can use any storage
    changeTheme(nextTheme)
  }

  return (
    <Row>
      <Col>
        <Navbar isBordered variant="floating">
          <Navbar.Brand hideIn="xs">
            <Text
              css={{
                lh: '$xs',
                textGradient: '45deg, $blue600 -20%, $pink600 50%',
              }}
              color="gradient"
              h2
            >
              OpenAI Calculator
            </Text>
          </Navbar.Brand>
          <Navbar.Content
            css={{
              ai: 'flex-start',
              fg: 1,
              px: '$xl',
              '@xsMax': {
                px: '$sm',
              },
            }}
            activeColor="secondary"
            variant="underline-rounded"
          >
            <NavLink href="/">Price Calculator</NavLink>
            <NavLink href="/tokenizer">Token Counter</NavLink>
          </Navbar.Content>
          <Navbar.Content>
            <Button
              auto
              color="gradient"
              bordered
              rounded
              onClick={handleChange}
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
          </Navbar.Content>
        </Navbar>
      </Col>
    </Row>
  )
}

export default NavBar
