import { Container } from '@nextui-org/react'
import Footer from 'src/layout/Footer'
import Header from 'src/layout/Header'
import Routes from 'src/layout/Routes'

function Layout() {
  return (
    <Container
      css={{ h: '100%', position: 'relative' }}
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
