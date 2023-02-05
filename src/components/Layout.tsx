import { Container } from '@nextui-org/react'
import Footer from './Footer'
import NavBar from './NavBar'
import Routes from './Routes'

function Layout() {
  return (
    <Container
      css={{ h: '100%' }}
      direction="column"
      display="flex"
      gap={0}
      responsive
      sm
      wrap="nowrap"
    >
      <NavBar />
      <Routes />
      <Footer />
    </Container>
  )
}

export default Layout
