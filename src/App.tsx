import {
  Col,
  Container,
  globalCss,
  Link,
  Navbar,
  Row,
  Text,
} from '@nextui-org/react'
import { Route, Switch } from 'wouter'
import NavLink from './components/NavLink'
import Calculator from './pages/Calculator'
import Tokenizer from './pages/Tokenizer'

const globalStyles = globalCss({
  html: { height: '100%' },
  body: { height: '100%' },
  '#root': { height: '100%' },
  'div[data-overlay-container="true"]': { height: '100%' },
})

function App() {
  globalStyles()
  return (
    <Container
      css={{ h: '100%' }}
      display="flex"
      direction="column"
      wrap="nowrap"
      sm
    >
      <Navbar isBordered variant="floating">
        <Navbar.Brand>
          <Text
            css={{
              lh: '$xs',
              // m: 0,
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
            color="gradient"
            h2
          >
            OpenAI Calculator
          </Text>
        </Navbar.Brand>
        <Navbar.Content
          css={{ ai: 'flex-start', fg: 1, px: '$xl' }}
          activeColor="secondary"
          enableCursorHighlight
          variant="underline-rounded"
        >
          <NavLink href="/">Price Calculator</NavLink>
          <NavLink href="/tokenizer">Token Counter</NavLink>
        </Navbar.Content>
      </Navbar>
      <Switch>
        <Route path="/tokenizer" component={Tokenizer} />
        <Route path="/token/:token" component={Calculator} />
        <Route path="/" component={Calculator} />
      </Switch>
      <Text css={{ mx: '$lg', ta: 'center' }} blockquote>
        {`© ${new Date().getFullYear()} - by `}
        <Link href="https://chengsokdara.github.io" target="_blank">
          Sokdara Cheng
        </Link>
      </Text>
    </Container>
  )
}

export default App
