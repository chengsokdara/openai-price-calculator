import { Container } from '@nextui-org/react'
import Footer from './Footer'
import Header from './Header'
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
      <Header />
      <Routes />
      <Footer />
    </Container>
  )
}

export default Layout
